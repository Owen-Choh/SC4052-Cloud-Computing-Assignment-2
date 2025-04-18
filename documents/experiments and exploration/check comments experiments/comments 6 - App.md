```tsx
import { useState, useEffect } from 'react';
import CodeEdit from './components/CodeEdit';
import CodeSearch from './components/CodeSearch';
import GeneralInfo from './components/GeneralInfo';
import { GithubProvider } from './context/useGithubContext';

/**
 * Main application component that renders the different tabs: GeneralInfo, CodeSearch, and CodeEdit.
 * It manages the state for tab selection and renders the corresponding component.
 */
function App() {
  // State to manage the currently selected tab.  Defaults to 'GeneralInfo'.
  const [tab, setTab] = useState('GeneralInfo');

  // Log the current tab for debugging purposes.
  console.log('tab', tab);

  return (
    // Main container with a flex layout to divide the screen into sidebar and main content.
    <div className="App flex h-screen w-screen">
      {/* Sidebar for tab navigation */}
      <div className="flex flex-col gap-4 items-center bg-gray-800 p-4 max-w-1/6 h-full">
        <h2 className="text-lg text-white">Tabs</h2>
        {/* GeneralInfo tab */}
        <p
          className={`text-lg text-gray-400 hover:text-white ${
            tab === 'GeneralInfo' ? 'text-white' : ''
          }`}
          onClick={() => setTab('GeneralInfo')}
        >
          GeneralInfo
        </p>
        {/* CodeSearch tab */}
        <p
          className={`text-lg text-gray-400 hover:text-white ${
            tab === 'CodeSearch' ? 'text-white' : ''
          }`}
          onClick={() => setTab('CodeSearch')}
        >
          CodeSearch
        </p>
        {/* CodeEdit tab */}
        <p
          className={`text-lg text-gray-400 hover:text-white ${
            tab === 'CodeEdit' ? 'text-white' : ''
          }`}
          onClick={() => setTab('CodeEdit')}
        >
          CodeEdit
        </p>
      </div>
      {/* Main content area */}
      <GithubProvider>
        {/* Render the GeneralInfo component if the 'GeneralInfo' tab is selected */}
        {tab == 'GeneralInfo' && <GeneralInfo />}
        {/* Render the CodeSearch component if the 'CodeSearch' tab is selected */}
        {tab == 'CodeSearch' && <CodeSearch />}
        {/* Render the CodeEdit component if the 'CodeEdit' tab is selected */}
        {tab == 'CodeEdit' && <CodeEdit />}
      </GithubProvider>
    </div>
  );
}

export default App;
```