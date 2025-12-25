"use client";

import { useMemo, useState } from "react";
import { ContentTone, DailyPlan, generateSchedule } from "@/lib/content";
import styles from "./page.module.css";

const toneLabels: Record<ContentTone, string> = {
  poetic: "Şiirsel",
  academic: "Akademik",
  provocative: "Provokatif",
  demystifying: "Sadeleştirici",
};

const toneOptions: ContentTone[] = [
  "poetic",
  "academic",
  "provocative",
  "demystifying",
];

const defaultDateISO = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split("T")[0]!;
};

const safeDate = (input: string) => {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
};

const formatPostType = (type: DailyPlan["posts"][number]["type"]) =>
  type === "reel" ? "Reels" : "Karusel / Statik";

export default function Home() {
  const [startDate, setStartDate] = useState(defaultDateISO);
  const [days, setDays] = useState(5);
  const [tone, setTone] = useState<ContentTone>("poetic");
  const [refreshKey, setRefreshKey] = useState(0);

  const schedule = useMemo(() => {
    const calendarStart = safeDate(startDate);
    return generateSchedule(calendarStart, days, tone, refreshKey);
  }, [startDate, days, tone, refreshKey]);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.tag}>Sanat Felsefesi & Kürasyon</span>
          <h1>Instagram içerik akışın için ajans gücünde yaratıcı ajan.</h1>
          <p>
            Her gün 3 paylaşım: iki Reels, bir karusel. Felsefi derinlik,
            küratoryal strateji ve uygulanabilir fikirler tek akışta. Zamanı,
            tonu ve anlatıyı seç, geri kalanını ajanına bırak.
          </p>
        </div>
        <aside className={styles.metrics}>
          <div>
            <span className={styles.metricNumber}>3</span>
            <span className={styles.metricLabel}>Günlük içerik</span>
          </div>
          <div>
            <span className={styles.metricNumber}>2</span>
            <span className={styles.metricLabel}>Reels ajandası</span>
          </div>
          <div>
            <span className={styles.metricNumber}>1</span>
            <span className={styles.metricLabel}>Küratoryal karusel</span>
          </div>
        </aside>
      </header>

      <section className={styles.controls}>
        <div className={styles.controlGroup}>
          <label htmlFor="date">Başlangıç tarihi</label>
          <input
            id="date"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className={styles.controlGroup}>
          <label htmlFor="days">Plan süresi (gün)</label>
          <input
            id="days"
            type="range"
            min={3}
            max={10}
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
          />
          <span className={styles.rangeValue}>{days} gün</span>
        </div>
        <div className={styles.tones}>
          {toneOptions.map((toneOption) => (
            <button
              key={toneOption}
              type="button"
              className={`${styles.toneButton} ${
                toneOption === tone ? styles.toneButtonActive : ""
              }`}
              onClick={() => setTone(toneOption)}
            >
              <span>{toneLabels[toneOption]}</span>
              <small>{toneOption === tone ? "aktif" : "seç"}</small>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.refresh}
          onClick={() => setRefreshKey((prev) => prev + 1)}
        >
          Yeni kombinasyon üret
        </button>
      </section>

      <section className={styles.schedule}>
        {schedule.map((day) => (
          <article key={day.date} className={styles.dayCard}>
            <header className={styles.dayHeader}>
              <div>
                <h2>{day.date}</h2>
                <p>{day.summary}</p>
              </div>
              <dl className={styles.dayMeta}>
                <div>
                  <dt>Başat filozof</dt>
                  <dd>{day.mainPhilosopher}</dd>
                </div>
                <div>
                  <dt>Tematik odak</dt>
                  <dd>{day.focusTheme}</dd>
                </div>
                <div>
                  <dt>Küratoryal açı</dt>
                  <dd>{day.curatorialAngle}</dd>
                </div>
              </dl>
            </header>
            <div className={styles.posts}>
              {day.posts.map((post) => (
                <div key={post.id} className={styles.postCard}>
                  <div className={styles.postType}>
                    {formatPostType(post.type)}
                  </div>
                  <h3>{post.title}</h3>
                  <p className={styles.postHook}>{post.hook}</p>
                  {"structure" in post ? (
                    <ul className={styles.postList}>
                      {post.structure.map((beat) => (
                        <li key={beat}>{beat}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className={styles.postList}>
                      {post.format.map((slide) => (
                        <li key={slide}>{slide}</li>
                      ))}
                    </ul>
                  )}
                  <div className={styles.postInsights}>
                    <div>
                      <strong>Konuşma noktaları</strong>
                      <ul>
                        {post.talkingPoints.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                    {"structure" in post ? (
                      <div className={styles.postDetails}>
                        <div>
                          <strong>Açılış sorusu</strong>
                          <p>{post.openingQuestion}</p>
                        </div>
                        <div>
                          <strong>Görsel öneri</strong>
                          <p>{post.visual}</p>
                        </div>
                        <div>
                          <strong>Ses önerisi</strong>
                          <p>{post.audio}</p>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.postDetails}>
                        <div>
                          <strong>Merkez içgörü</strong>
                          <p>{post.insight}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <footer className={styles.postFooter}>
                    <span>{post.callToAction}</span>
                    <div className={styles.hashtags}>
                      {post.hashtags.map((tag) => (
                        <code key={tag}>{tag}</code>
                      ))}
                    </div>
                  </footer>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
