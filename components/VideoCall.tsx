import { getStreamVideoToken } from '@/lib/actions/stream';
import { cn } from '@/lib/helpers/helpers';
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  type Call,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useEffect, useState } from 'react';
import { FullPageLoader } from './FullPageLoader';

interface VideoCallProps {
  callId: string;
  onCallEnd: () => void;
  isIncoming?: boolean;
}

export default function VideoCall({ callId, onCallEnd, isIncoming = false }: VideoCallProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [hasLeft, setHasLeft] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function initializeVideoCall() {
      if (hasJoined || hasLeft) {
        return;
      }

      try {
        setError(null);
        const { token, userId, userImage, userName } = await getStreamVideoToken();

        if (!isMounted || !token) return;

        const videoClient = new StreamVideoClient({
          apiKey: process.env['NEXT_PUBLIC_STREAM_API_KEY']!,
          user: {
            id: userId!,
            name: userName,
            image: userImage,
          },
          token: token,
        });

        if (!isMounted) return;

        const videoCall = videoClient.call('default', callId);

        if (isIncoming) {
          await videoCall.join();
        } else {
          await videoCall.join({ create: true });
        }

        if (!isMounted) return;

        setClient(videoClient);
        setCall(videoCall);
        setHasJoined(true);
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setError('Failed to initiate call');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeVideoCall();

    return () => {
      isMounted = false;
    };
  }, [callId, isIncoming, hasJoined, hasLeft]);

  // Separate cleanup effect
  useEffect(() => {
    return () => {
      if (call && hasJoined && !hasLeft) {
        setHasLeft(true);
        call.leave().catch((error) => {
          // Ignore "already left" errors
          if (!error.message?.includes('already been left')) {
            console.error('Error leaving call:', error);
          }
        });
      }

      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [call, client, hasJoined, hasLeft]);

  // Handle call end from UI
  const handleCallEnd = () => {
    if (call && hasJoined && !hasLeft) {
      setHasLeft(true);
      call.leave().catch((error) => {
        // Ignore "already left" errors
        if (!error.message?.includes('already been left')) {
          console.error('Error leaving call:', error);
        }
      });
    }
    onCallEnd();
  };

  if (loading) {
    return <FullPageLoader text={isIncoming ? 'Joining call...' : 'Starting call...'} />;
  }

  if (error) {
    return (
      <div
        className={cn('bg-opacity-75 jsutify-center fixed inset-0 z-50 flex items-center bg-black')}
      >
        <div className={cn('mx-auto max-w-md p-8 text-center text-white')}>
          <div
            className={cn(
              'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500'
            )}
          >
            <span className={cn('text-2xl')}>❌</span>
          </div>
          <h3 className={cn('mb-2 text-xl font-semibold')}>Call Error</h3>
          <p className={cn('mb-4 text-gray-300')}></p>
          <button
            onClick={handleCallEnd}
            className={cn(
              'rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white',
              'transition-all duration-200 hover:from-pink-600 hover:to-red-600'
            )}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div
        className={cn('bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black')}
      >
        <div className={cn('text-center text-white')}>
          <div
            className={cn(
              'mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-white'
            )}
          />
          <p className={cn('text-lg')}>Setting up call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('fixed inset-0 z-50 bg-black')}>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
            <SpeakerLayout />
            <CallControls onLeave={handleCallEnd} />
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </div>
  );
}
