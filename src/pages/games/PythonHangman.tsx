import PythonGameWidget from '../../components/PythonGameWidget';

export default function PythonHangman() {
    return (
        <PythonGameWidget 
            title="Hangman" 
            description="The classic word guessing game, powered by Python in your browser." 
            scriptPath="/hangman/hangman.py" 
            gameId="hangman"
            winXp={120}
            lossXp={15}
        />
    );
}
