export function SetupCard({ rejected }: { rejected?: boolean }) {
  return (
    <div className="card p-5">
      <h2 className="text-lg">{rejected ? "Panta rejected the API key" : "Connect your Panta API key"}</h2>
      <p className="mute mt-1 text-sm">{rejected ? "The key in .env.local is invalid or expired. Create a new one and restart the dev server." : "Markets load straight from the Panta API, so the server needs a key first."}</p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
        <li>Open <a className="underline" href="https://docs.panta.market" target="_blank" rel="noreferrer">docs.panta.market</a>, follow the Authentication guide, and create a key (it starts with <code>pk_test_</code>).</li>
        <li>In the project folder run <code>cp .env.example .env.local</code>, then set <code>PANTA_API_KEY=your_key</code>.</li>
        <li>Stop and restart <code>npm run dev</code>.</li>
      </ol>
    </div>
  );
}
