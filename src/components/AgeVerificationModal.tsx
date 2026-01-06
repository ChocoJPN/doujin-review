"use client";

import { useEffect, useState } from 'react';
import styles from './AgeVerificationModal.module.css';

export default function AgeVerificationModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check local storage
    const hasVerified = localStorage.getItem('age-verified');
    if (!hasVerified) {
      setIsVisible(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVisible(false);
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isMounted) return null;
  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>年齢確認 / Age Verification</h2>
        <p className={styles.message}>
          本サイト「世の中に同人誌を広めたい」には、成人向け(R18)のコンテンツが含まれている可能性があります。<br />
          あなたは18歳以上ですか？
        </p>
        <div className={styles.buttonGroup}>
          <button onClick={handleDeny} className={`${styles.button} ${styles.denyButton}`}>
            いいえ (Exit)
          </button>
          <button onClick={handleConfirm} className={`${styles.button} ${styles.confirmButton}`}>
            はい、18歳以上です
          </button>
        </div>
      </div>
    </div>
  );
}
