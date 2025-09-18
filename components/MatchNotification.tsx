'use client';

import { UserProfile } from '@/app/profile/page';
import { useState } from 'react';

export default function MatchNotification() {
  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showMatchNotification, setShowMatchNotification] = useState<boolean>(false);

  return <div>MatchNotification</div>;
}
