const NEWS = [
  { date: 'May 20, 2026', title: 'Codelude.com launched.', body: 'The Codelude studio site is live at codelude.com — consolidating all four ventures under a single public presence with SSL and PM2 process management.' },
  { date: 'May 20, 2026', title: 'hq.codelude.com deployed.', body: 'Internal company dashboard live with team login, venture tracking, and activity feed.' },
  { date: 'May 19, 2026', title: 'Franchiseen payout architecture finalized.', body: 'Revenue-sharing and investor payout structure locked. First franchise partner onboarding begins next quarter.' },
  { date: 'May 15, 2026', title: 'Roborns thermal feasibility study commissioned.', body: 'Engagement with coastal infrastructure specialists begins. Site survey for the Mangaluru pilot facility underway.' },
  { date: 'May 10, 2026', title: 'HubCV matching engine in development.', body: 'AI-driven candidate-to-opportunity matching core in active development. First recruiter partnerships being established ahead of beta.' },
  { date: 'Mar 2026', title: 'Llife five-domain model published.', body: 'Finances, Education, Earnings, Mind and Body fixed as the assistant\'s domains, each mapped to a daily time block. HubCV, Dextrip and Franchiseen agreed as the first data sources.' },
];

export default function NewsPage() {
  return (
    <div>
      <div className="news-list">
        {NEWS.map((item, i) => (
          <div key={i} className="news-item">
            <div className="news-date">{item.date}</div>
            <div className="news-content">
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
