import CodeEdit from './components/CodeEdit';
import CodeSearch from './components/CodeSearch';
import GeneralInfo from './components/GeneralInfo';
import { GithubProvider } from './context/useGithubContext';

function App() {
  return (
    <div className="App flex flex-col gap-2 w-screen h-screen">
      <GithubProvider>
        <GeneralInfo />
        <CodeSearch />
        <CodeEdit />
      </GithubProvider>
    </div>
  );
}

export default App;