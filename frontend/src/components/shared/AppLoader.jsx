import React, { useEffect, useMemo, useState } from 'react';
import { useLoading } from '../../context/LoadingContext';
import styles from './AppLoader.module.css';

const SEQUENCE = [
  'Loading Portfolio...',
  'Connecting Backend...',
  'Fetching Projects...',
  'Loading Certifications...',
  'Access Granted',
];

const FINAL_LINES = [
  'MERN Stack Developer',
  'Cybersecurity Enthusiast',
];

const TYPE_SPEED = 40;
const FAST_TYPE_SPEED = 18;
const LINE_DELAY = 360;
const FAST_LINE_DELAY = 90;

export default function AppLoader() {
  const { loading } = useLoading();
  const [visible, setVisible] = useState(false);
  const [typedLines, setTypedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [done, setDone] = useState(false);
  const [fastMode, setFastMode] = useState(false);
  const hideTimeout = React.useRef(null);
  const maxTimeout = React.useRef(null);

  const allLines = useMemo(() => ['Initializing...', ...SEQUENCE], []);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      setTypedLines([]);
      setCurrentLine(0);
      setCurrentText('');
      setDone(false);
      setFastMode(false);

      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
      if (maxTimeout.current) {
        clearTimeout(maxTimeout.current);
        maxTimeout.current = null;
      }

      maxTimeout.current = setTimeout(() => {
        setVisible(false);
      }, 15000);

      return;
    }

    if (!loading && visible) {
      setFastMode(true);
    }
  }, [loading, visible]);

  useEffect(() => {
    if (!visible) return undefined;
    if (done) return undefined;

    let timeoutId;
    const line = allLines[currentLine] || '';
    const isLineComplete = currentText === line;
    const typeDelay = fastMode ? FAST_TYPE_SPEED : TYPE_SPEED;
    const stepDelay = fastMode ? FAST_LINE_DELAY : LINE_DELAY;

    if (!isLineComplete) {
      timeoutId = setTimeout(() => {
        setCurrentText(line.slice(0, currentText.length + 1));
      }, typeDelay);
    } else if (currentLine < allLines.length) {
      timeoutId = setTimeout(() => {
        setTypedLines((prev) => [...prev, line]);
        setCurrentLine((prev) => prev + 1);
        setCurrentText('');
      }, stepDelay);
    } else {
      setDone(true);
    }

    return () => clearTimeout(timeoutId);
  }, [allLines, currentLine, currentText, done, fastMode, visible]);

  useEffect(() => {
    if (!visible) return undefined;

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }

    if (done) {
      hideTimeout.current = setTimeout(() => setVisible(false), 540);
      return () => clearTimeout(hideTimeout.current);
    }

    return undefined;
  }, [done, visible]);

  useEffect(() => {
    if (!visible) return undefined;

    if (!done && !loading) {
      setFastMode(true);
    }

    if (done && loading) {
      setFastMode(false);
    }

    return undefined;
  }, [done, loading, visible]);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      if (maxTimeout.current) clearTimeout(maxTimeout.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`${styles.loader} ${loading ? styles.active : ''}`}>
      <div className={styles.particles} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.panel}>
        <div className={styles.brand}>Hassan Lodhi</div>
        <div className={styles.terminal}>
          <div className={styles.header}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.title}>Initializing system</span>
          </div>
          <div className={styles.body}>
            {typedLines.map((line, index) => (
              <div key={`line-${index}`} className={styles.line}>
                <span className={styles.prompt}>›</span>
                <span>{line}</span>
              </div>
            ))}
            {!done && (
              <div className={styles.line}>
                <span className={styles.prompt}>›</span>
                <span>{currentText}</span>
                <span className={styles.cursor} />
              </div>
            )}
            {done && (
              <div className={styles.line}>
                <span className={styles.prompt}>›</span>
                <span>Ready.</span>
              </div>
            )}
          </div>
        </div>

        {done && (
          <div className={styles.final}>
            {FINAL_LINES.map((text) => (
              <div key={text} className={styles.finalLine}>{text}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
