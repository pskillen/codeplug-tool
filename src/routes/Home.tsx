import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="app-main">
      <h1>opengd77-map</h1>
      <p>
        Browser tools for visualising OpenGD77 codeplug geography. CSV files stay on your
        machine.
      </p>
      <ul>
        <li>
          <Link to="/map">Channel map</Link> — plot <code>Channels.csv</code> and zone hulls
          from <code>Zones.csv</code>
        </li>
      </ul>
    </main>
  );
}
