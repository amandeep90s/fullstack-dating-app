import { createOrGetChannel, createVideoCall, getStreamUserToken } from '@/lib/actions/stream';
import { cn } from '@/lib/helpers/helpers';
import type { Message, UserProfile } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useImperativeHandle, useRef, useState, type RefObject } from 'react';
import { StreamChat, type Channel, type Event } from 'stream-chat';
import { FullPageLoader } from './FullPageLoader';
import { DownArrowIcon, SendIcon } from './icons';
import VideoCall from './VideoCall';

interface StreamChatInterfaceProps {
  otherUser: UserProfile;
  ref: RefObject<{ handleVideoCall: () => void } | null>;
}

export default function StreamChatInterface({ otherUser, ref }: StreamChatInterfaceProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const [videoCallId, setVideoCallId] = useState<string>('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isCallInitiator, setIsCallInitiator] = useState<boolean>(false);
  const [incomingCallId, setIncomingCallId] = useState<string>('');
  const [callerName, setCallerName] = useState<string>('');
  const [showIncomingCall, setShowIncomingCall] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  }

  function handleScroll() {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [handleScroll]);

  useEffect(() => {
    setShowVideoCall(false);
    setVideoCallId('');
    setShowIncomingCall(false);
    setIncomingCallId('');
    setCallerName('');
    setIsCallInitiator(false);

    let isMounted = true;

    async function initializeChat() {
      try {
        setError(null);

        const { token, userId, userName, userImage } = await getStreamUserToken();

        if (!isMounted) return;

        setCurrentUserId(userId!);

        const chatClient = StreamChat.getInstance(process.env['NEXT_PUBLIC_STREAM_API_KEY']!);

        // Check if user is already connected to avoid consecutive connectUser calls
        if (!chatClient.user || chatClient.user.id !== userId) {
          // Disconnect any existing connection first
          if (chatClient.user) {
            await chatClient.disconnectUser();
          }

          await chatClient.connectUser(
            {
              id: userId!,
              name: userName,
              image: userImage,
            },
            token
          );
        }

        if (!isMounted) return;

        const { channelType, channelId } = await createOrGetChannel(otherUser.id);

        // Get the channel
        const chatChannel = chatClient.channel(channelType!, channelId);
        await chatChannel.watch();

        if (!isMounted) return;

        // Load existing messages
        const state = await chatChannel.query({ messages: { limit: 50 } });

        // Convert stream messages to our format
        const convertedMessages: Message[] = state.messages.map((msg) => ({
          id: msg.id,
          text: msg.text || '',
          sender: msg.user?.id === userId ? 'me' : 'other',
          timestamp: new Date(msg.created_at || new Date()),
          user_id: msg.user?.id || '',
        }));

        if (!isMounted) return;

        setMessages(convertedMessages);

        chatChannel.on('message.new', (event: Event) => {
          if (!isMounted) return;

          if (event.message) {
            if (event.message.text?.includes(`📹 Video call invitation`)) {
              const customData = event.message as any;

              if (customData.caller_id !== userId) {
                setIncomingCallId(customData.call_id);
                setCallerName(customData.caller_name || 'Someone');
                setShowIncomingCall(true);
              }
              return;
            }

            if (event.message.user?.id !== userId) {
              const newMsg: Message = {
                id: event.message.id,
                text: event.message.text || '',
                sender: 'other',
                timestamp: new Date(event.message.created_at || new Date()),
                user_id: event.message.user?.id || '',
              };

              setMessages((prev) => {
                const messageExists = prev.some((msg) => msg.id === newMsg.id);
                if (!messageExists) {
                  return [...prev, newMsg];
                }

                return prev;
              });
            }
          }
        });

        chatChannel.on('typing.start', (event: Event) => {
          if (!isMounted) return;
          if (event.user?.id !== userId) {
            setIsTyping(true);
          }
        });

        chatChannel.on('typing.stop', (event: Event) => {
          if (!isMounted) return;
          if (event.user?.id !== userId) {
            setIsTyping(false);
          }
        });

        if (isMounted) {
          setClient(chatClient);
          setChannel(chatChannel);
        }
      } catch (error) {
        if (isMounted) {
          router.push('/chat');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (otherUser) {
      initializeChat();
    }

    return () => {
      isMounted = false;

      // Clean up by accessing the current client instance directly
      const chatClient = StreamChat.getInstance(process.env['NEXT_PUBLIC_STREAM_API_KEY']!);

      // Only disconnect if we have a connected user
      if (chatClient.user) {
        chatClient.disconnectUser().catch(console.error);
      }
    };
  }, [otherUser, router]);

  async function handleVideoCall() {
    try {
      const { callId } = await createVideoCall(otherUser.id);
      setVideoCallId(callId!);
      setShowVideoCall(true);
      setIsCallInitiator(true);

      if (channel) {
        const messageData = {
          text: `📹 Video call invitation`,
          call_id: callId,
          caller_id: currentUserId,
          caller_name: otherUser.full_name || 'Someone',
        };

        await channel.sendMessage(messageData);
      }
    } catch (error) {
      console.error('Error initiating video call:', error);
    }
  }

  useImperativeHandle(ref, () => ({
    handleVideoCall,
  }));

  async function handleSendMessage(event: React.FormEvent) {
    event.preventDefault();

    if (newMessage.trim() && channel) {
      try {
        const response = await channel.sendMessage({
          text: newMessage,
        });

        const message: Message = {
          id: response.message.id,
          text: newMessage,
          sender: 'me',
          timestamp: new Date(),
          user_id: currentUserId || '',
        };

        setMessages((prevMessage) => {
          const messageExists = prevMessage.some((msg) => msg.id === message.id);
          if (!messageExists) {
            return [...prevMessage, message];
          }
          return prevMessage;
        });

        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  function handleCallEnd() {
    setShowVideoCall(false);
    setVideoCallId('');
    setIsCallInitiator(false);

    // Clear any pending incoming call state when call made
    setShowIncomingCall(false);
    setIncomingCallId('');
    setCallerName('');
  }

  function handleDeclineCall() {
    setShowIncomingCall(false);
    setIncomingCallId('');
    setCallerName('');
  }

  function handleAcceptCall() {
    setVideoCallId(incomingCallId);
    setShowVideoCall(true);
    setShowIncomingCall(false);
    setIncomingCallId('');
    setIsCallInitiator(false);
  }

  function formatTime(date: Date) {
    return date.toLocaleDateString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (!client || !channel) {
    return <FullPageLoader text="Setting up chat..." />;
  }

  return (
    <div className={cn('flex h-full flex-col bg-white dark:bg-gray-900')}>
      <div
        ref={messagesContainerRef}
        className={cn(
          'chat-scrollbar relative min-h-[calc(100vh-14rem)] flex-1 space-y-4 overflow-y-auto scroll-smooth p-4'
        )}
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((message, key) => (
          <div
            key={key}
            className={cn('flex', message.sender === 'me' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-xs rounded-2xl px-4 py-2 lg:max-w-md',
                message.sender === 'me'
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                  : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
              )}
            >
              <p className={cn('text-sm')}>{message.text}</p>
              <p
                className={cn(
                  'mt-1 text-xs',
                  message.sender === 'me' ? 'text-pink-100' : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={cn('flex justify-start')}>
            <div
              className={cn(
                'rounded-2xl bg-gray-200 px-4 py-2 text-gray-900 dark:bg-gray-700 dark:text-white'
              )}
            >
              <div className={cn('flex space-x-1')}>
                <div className={cn('h-2 w-2 animate-bounce rounded-full bg-gray-400')} />
                <div
                  className={cn('h-2 w-2 animate-bounce rounded-full bg-gray-400')}
                  style={{ animationDelay: '0.1s' }}
                />
                <div className={cn('h-2 w-2 animate-bounce rounded-full bg-gray-400')} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <div className={cn('absolute right-6 bottom-20 z-10')}>
          <button
            onClick={scrollToBottom}
            title="Scroll to bottom"
            className={cn(
              'rounded-full bg-pink-500 p-3 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-pink-600'
            )}
          >
            <DownArrowIcon />
          </button>
        </div>
      )}

      {/* Message input */}
      <div className={cn('border-t border-gray-200 p-4 dark:border-gray-700')}>
        <form className={cn('flex space-x-2')} onSubmit={handleSendMessage}>
          <input
            type="text"
            id="message"
            name="message"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);

              if (channel && e.target.value.length > 0) {
                try {
                  channel.keystroke();
                } catch (error) {
                  console.debug('Keystroke event failed:', error);
                }
              }
            }}
            onFocus={(e) => {
              if (channel && client && client.user) {
                try {
                  channel.keystroke();
                } catch (error) {
                  console.debug('Keystroke event failed:', error);
                }
              }
            }}
            placeholder="Type a message..."
            disabled={!channel}
            className={cn(
              'flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-transparent',
              'focus:ring-2 focus:ring-pink-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            )}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !channel}
            className={cn(
              'rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-2 text-white transition-all duration-200',
              'hover:from-pink-600 hover:to-red-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <SendIcon />
          </button>
        </form>
      </div>

      {showIncomingCall && (
        <div
          className={cn(
            'bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black'
          )}
        >
          <div className={cn('mx-4 max-w-sm rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800')}>
            <div className={cn('text-center')}>
              <div
                className={cn(
                  'mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-pink-500'
                )}
              >
                <Image
                  src={otherUser.avatar_url}
                  alt={otherUser.full_name}
                  className={cn('h-full w-full object-cover')}
                  height={80}
                  width={80}
                />
              </div>
              <h3 className={cn('mb-2 text-xl font-semibold text-gray-900 dark:text-white')}>
                Incoming Video Call
              </h3>
              <p className={cn('mb-6 text-gray-600 dark:text-gray-400')}>
                {callerName} is calling you
              </p>

              <div className={cn('flex space-x-4')}>
                <button
                  type="button"
                  onClick={handleDeclineCall}
                  className={cn(
                    'flex-1 rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-600'
                  )}
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={handleAcceptCall}
                  className={cn(
                    'flex-1 rounded-full bg-green-500 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-green-600'
                  )}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVideoCall && videoCallId && (
        <VideoCall onCallEnd={handleCallEnd} callId={videoCallId} isIncoming={!isCallInitiator} />
      )}
    </div>
  );
}
