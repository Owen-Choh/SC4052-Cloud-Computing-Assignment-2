import CodeSearch from './CodeSearch';
import Settings from './Settings';
import { GithubProvider } from './context/useGithubContext';

function App() {
  return (
    <div className="App">
      <GithubProvider>
        <Settings />
        <CodeSearch />
      </GithubProvider>
    </div>
  );
}

export default App;