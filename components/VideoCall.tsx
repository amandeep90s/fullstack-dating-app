interface VideoCallProps {
  callId: string;
  onCallEnd: () => void;
  isIncoming?: boolean;
}

export default function VideoCall({ callId, onCallEnd, isIncoming = false }: VideoCallProps) {
  return <div>VideoCall</div>;
}
