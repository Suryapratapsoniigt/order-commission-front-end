import { Outlet } from 'react-router-dom';

// main layout stying
const layoutStyle = {
    overflow: 'hidden',
    with: '100%',
    minHeight: '100vh'
};

// header styling
const headerStyle: React.CSSProperties = {
    color: 'red',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
};
  
// main content styling 
const contentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
};


// root layout component
const RootLayout = () => {
  return (
    <main style={layoutStyle}>
        <section>
            {/* header  */}
            <header style={headerStyle}></header>
            {/* main content  */}
            <section style={contentStyle}>
                <Outlet/>
            </section>
            {/* footer  */}
        </section>
    </main>
  )
}

export default RootLayout
