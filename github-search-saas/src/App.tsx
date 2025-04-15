```typescript
import { useState } from 'react';
import CodeEdit from './components/CodeEdit';
import CodeSearch from './components/CodeSearch';
import GeneralInfo from './components/GeneralInfo';
import { GithubProvider } from './context/useGithubContext';

function App() {
  // State to manage the active tab
  const [tab, setTab] = useState('GeneralInfo');
  console.log('tab', tab);
  return (
    <div className="App flex h-screen w-screen">
      {/* side bar */}
      <div className="flex flex-col gap-4 items-center bg-gray-800 p-4 max-w-1/6 h-full">
        <h2 className="text-lg text-white">Tabs</h2>
        {/* General Info Tab */}
        <p
          className={`text-lg text-gray-400 hover:text-white ${tab === 'GeneralInfo' ? 'text-white' : ''}`}
          onClick={() => setTab('GeneralInfo')}
        >
          GeneralInfo
        </p>
        {/* Code Search Tab */}
        <p
          className={`text-lg text-gray-400 hover:text-white ${tab === 'CodeSearch' ? 'text-white' : ''}`}
          onClick={() => setTab('CodeSearch')}
        >
          CodeSearch
        </p>
        {/* Code Edit Tab */}
        <p
          className={`text-lg text-gray-400 hover:text-white ${tab === 'CodeEdit' ? 'text-white' : ''}`}
          onClick={() => setTab('CodeEdit')}
        >
          CodeEdit
        </p>
      </div>
      {/* main content */}
      {/* Provides the Github context to all child components */}
      <GithubProvider>
        {/* Conditionally render the GeneralInfo component if the tab state is 'GeneralInfo' */}
        {tab == 'GeneralInfo' && <GeneralInfo />}
        {/* Conditionally render the CodeSearch component if the tab state is 'CodeSearch' */}
        {tab == 'CodeSearch' && <CodeSearch />}
        {/* Conditionally render the CodeEdit component if the tab state is 'CodeEdit' */}
        {tab == 'CodeEdit' && <CodeEdit />}
      </GithubProvider>
    </div>
  );
}

export default App;
```