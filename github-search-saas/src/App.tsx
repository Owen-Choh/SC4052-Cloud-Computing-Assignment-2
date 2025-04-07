import CodeSearch from './CodeSearch';
import GeneralInfo from './components/GeneralInfo';
import { GithubProvider } from './context/useGithubContext';

function App() {
  return (
    <div className="App">
      <GithubProvider>
        <GeneralInfo />
        <CodeSearch />
      </GithubProvider>
    </div>
  );
}

export default App;