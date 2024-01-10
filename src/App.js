import Copter from './components/canvas'

const styles = {
    app: {
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgb(241 245 249)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'column',
    },
    header: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#000000',
    },
}

function App() {
    return (
        <main className='App' style={styles.app}>
            <h1 style={styles.header}>Canvas chart..</h1>
            <Copter />
        </main>
    )
}

export default App
