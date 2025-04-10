import { useState } from 'react';
import CodeEdit from './components/CodeEdit';
import CodeSearch from './components/CodeSearch';
import GeneralInfo from './components/GeneralInfo';
import { GithubProvider } from './context/useGithubContext';

function App() {
  const [tab, setTab] = useState('GeneralInfo');
  console.log('tab', tab);
  return (
    <div className="App flex h-screen w-screen">
      {/* side bar */}
      <div className="flex flex-col gap-4 items-center bg-gray-800 p-4 max-w-1/6 h-full">
        <h2 className="text-lg text-white">Tabs</h2>
        <p className="text-lg text-gray-400 hover:text-white" onClick={()=>setTab('GeneralInfo')}>GeneralInfo</p>
        <p className="text-lg text-gray-400 hover:text-white" onClick={()=>setTab('CodeSearch')}>CodeSearch</p>
        <p className="text-lg text-gray-400 hover:text-white" onClick={()=>setTab('CodeEdit')}>CodeEdit</p>
      </div>
      {/* main content */}
      <GithubProvider>
        {tab == 'GeneralInfo' && <GeneralInfo />}
        {tab == 'CodeSearch' && <CodeSearch />}
        {tab == 'CodeEdit' && <CodeEdit />}
      </GithubProvider>
    </div>
  );
}

export default App;