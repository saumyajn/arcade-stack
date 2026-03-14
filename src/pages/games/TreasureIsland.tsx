import PythonGameWidget from '../../components/PythonGameWidget';

export default function TreasureIsland() {
    return (
        <PythonGameWidget 
            title="Treasure Island" 
            description="A classic text-based adventure game written in Python. Make choices to find the hidden treasure!" 
            scriptPath="/treasure_island.py" 
        />
    );
}