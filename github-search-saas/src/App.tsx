import CodeSearch from './CodeSearch';
import GeneralInfo from './components/GeneralInfo';
import { GithubProvider } from './context/useGithubContext';

function App() {
  return (
    <div className="App flex flex-col gap-2">
      <GithubProvider>
        <GeneralInfo />
        <CodeSearch />
      </GithubProvider>
    </div>
  );
}

export default App;