// TicTacToeStyles.js
const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',  // Keeps horizontal centering
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      // New properties to center vertically
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      // Optional: Set a minimum height for the viewport
      minHeight: '600px',
    },
    header: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333'
    },
    status: {
      textAlign: 'center',
      fontSize: '20px',
      marginBottom: '20px',
      fontWeight: 'bold'
    },
    board: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '20px'
    },
    square: {
      width: '80px',
      height: '80px',
      fontSize: '32px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      border: '2px solid #ddd',
      cursor: 'pointer'
    },
    highlighted: {
      backgroundColor: '#ffffaa'
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '20px'
    },
    button: {
      padding: '8px 16px',
      fontSize: '16px',
      fontWeight: 'bold',
      borderRadius: '4px',
      cursor: 'pointer',
      border: 'none'
    },
    primaryButton: {
      backgroundColor: '#4269f5',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#f44336',
      color: 'white'
    },
    modeSelectorActive: {
      backgroundColor: '#4269f5',
      color: 'white'
    },
    modeSelectorInactive: {
      backgroundColor: '#e2e2e2',
      color: '#333'
    },
    scoreSection: {
      marginBottom: '20px'
    },
    scoreTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '10px'
    },
    scoreBoard: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px'
    },
    scoreItem: {
      textAlign: 'center'
    },
    scoreValue: {
      fontSize: '24px'
    },
    playerX: {
      color: '#4269f5'
    },
    playerO: {
      color: '#f44336'
    }
};

export default styles;