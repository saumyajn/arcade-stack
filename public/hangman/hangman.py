import random

backup_word_list = [
    "abruptly",
    "absurd",
    "abyss",
    "affix",
    "askew",
    "avenue",
    "awkward",
    "axiom",
    "azure",
    "bagpipes",
    "bandwagon",
    "banjo",
    "bayou",
    "beekeeper",
    "bikini",
    "blitz",
    "blizzard",
    "boggle",
    "bookworm",
    "boxcar",
    "boxful",
    "buckaroo",
    "buffalo",
    "buffoon",
    "buxom",
    "buzzard",
    "buzzing",
    "buzzwords",
    "caliph",
    "cobweb",
    "cockiness",
    "croquet",
    "crypt",
    "curacao",
    "cycle",
    "daiquiri",
    "dirndl",
    "disavow",
    "dizzying",
    "duplex",
    "dwarves",
    "embezzle",
    "equip",
    "espionage",
    "euouae",
    "exodus",
    "faking",
    "fishhook",
    "fixable",
    "fjord",
    "flapjack",
    "flopping",
    "fluffiness",
    "flyby",
    "foxglove",
    "frazzled",
    "frizzled",
    "fuchsia",
    "funny",
    "gabby",
    "galaxy",
    "galvanize",
    "gazebo",
    "giaour",
    "gizmo",
    "glowworm",
    "glyph",
    "gnarly",
    "gnostic",
    "gossip",
    "grogginess",
    "haiku",
    "haphazard",
    "hyphen",
    "iatrogenic",
    "icebox",
    "injury",
    "ivory",
    "ivy",
    "jackpot",
    "jaundice",
    "jawbreaker",
    "jaywalk",
    "jazziest",
    "jazzy",
    "jelly",
    "jigsaw",
    "jinx",
    "jiujitsu",
    "jockey",
    "jogging",
    "joking",
    "jovial",
    "joyful",
    "juicy",
    "jukebox",
    "jumbo",
    "kayak",
    "kazoo",
    "keyhole",
    "khaki",
    "kilobyte",
    "kiosk",
    "kitsch",
    "kiwifruit",
    "klutz",
    "knapsack",
    "larynx",
    "lengths",
    "lucky",
    "luxury",
    "lymph",
    "marquis",
    "matrix",
    "megahertz",
    "microwave",
    "mnemonic",
    "mystify",
    "naphtha",
    "nightclub",
    "nowadays",
    "numbskull",
    "nymph",
    "onyx",
    "ovary",
    "oxidize",
    "oxygen",
    "pajama",
    "peekaboo",
    "phlegm",
    "pixel",
    "pizazz",
    "pneumonia",
    "polka",
    "pshaw",
    "psyche",
    "puppy",
    "puzzling",
    "quartz",
    "queue",
    "quips",
    "quixotic",
    "quiz",
    "quizzes",
    "quorum",
    "razzmatazz",
    "rhubarb",
    "rhythm",
    "rickshaw",
    "schnapps",
    "scratch",
    "shiv",
    "snazzy",
    "sphinx",
    "spritz",
    "squawk",
    "staff",
    "strength",
    "strengths",
    "stretch",
    "stronghold",
    "stymied",
    "subway",
    "swivel",
    "syndrome",
    "thriftless",
    "thumbscrew",
    "topaz",
    "transcript",
    "transgress",
    "transplant",
    "triphthong",
    "twelfth",
    "twelfths",
    "unknown",
    "unworthy",
    "unzip",
    "uptown",
    "vaporize",
    "vixen",
    "vodka",
    "voodoo",
    "vortex",
    "voyeurism",
    "walkway",
    "waltz",
    "wave",
    "wavy",
    "waxy",
    "wellspring",
    "wheezy",
    "whiskey",
    "whizzing",
    "whomever",
    "wimpy",
    "witchcraft",
    "wizard",
    "woozy",
    "wristwatch",
    "wyvern",
    "xylophone",
    "yachtsman",
    "yippee",
    "yoked",
    "youthful",
    "yummy",
    "zephyr",
    "zigzag",
    "zigzagging",
    "zilch",
    "zipper",
    "zodiac",
    "zombie",
]

stages = [
    r"""
  +---+
  |   |
  O   |
 /|\  |
 / \  |
      |
=========
""",
    r"""
  +---+
  |   |
  O   |
 /|\  |
 /    |
      |
=========
""",
    r"""
  +---+
  |   |
  O   |
 /|\  |
      |
      |
=========
""",
    """
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========""",
    """
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
""",
    """
  +---+
  |   |
  O   |
      |
      |
      |
=========
""",
    """
  +---+
  |   |
      |
      |
      |
      |
=========
""",
]

logo = r""" 
 _                                             
| |                                            
| |__   __ _ _ __   __ _ _ __ ___   __ _ _ __  
| '_ \ / _` | '_ \ / _` | '_ ` _ \ / _` | '_ \ 
| | | | (_| | | | | (_| | | | | | | (_| | | | |
|_| |_|\__,_|_| |_|\__, |_| |_| |_|\__,_|_| |_|
                    __/ |                      
                   |___/    """

# 1. Initialize persistent state variables on the first run
if "step" not in globals():
    step = 0
    lives = 6
    random_word = ""
    guessed = []
    correct_letters = []
    display = ""

# 2. Capture user input sent from the React app
user_input = cmd if "cmd" in globals() else ""
user_input = user_input.strip().lower()

# STEP 0: Game Setup & Fetching the Word
if step == 0:
    print(logo)
    print("Welcome!\nA word has been randomly generated. Lets play!!")

    # Keep startup instant in the browser. Remote word APIs can stall inside
    # Pyodide and make the game look like it never loaded.
    word_list = backup_word_list

    random_word = random.choice(word_list)
    word_len = len(random_word)

    # Reset game state variables for a fresh game
    lives = 6
    guessed = []
    correct_letters = []
    display = "_ " * word_len

    print(stages[0])
    print("Word to guess: " + display)
    print("\nGuess a letter: ")

    # Move to the guessing loop
    step = 1

# STEP 1: The Guessing Loop
elif step == 1:
    guess = user_input

    # Input validation
    if not guess or len(guess) != 1 or not guess.isalpha():
        print("Please enter a single valid letter.\n\nGuess a letter:")
    elif guess in guessed:
        print(
            f"Oops! You already guessed the letter '{guess}' before. Please guess a new letter!\n\nGuess a letter:"
        )
    else:
        # Valid new guess
        guessed.append(guess)

        if guess in random_word:
            correct_letters.append(guess)
        else:
            # Wrong guess logic (matching your original math)
            print(stages[-lives])
            lives -= 1
            print(
                f"You guessed '{guess}', that is not in the word. You lost a life!! 💀\n"
            )

        # Update the hidden display
        display = ""
        for letter in random_word:
            if letter in correct_letters:
                display += letter
            else:
                display += "_ "

        print(f"Word to Guess: {display}\n")

        # Check Win / Loss conditions
        if lives == 0:
            print("**** YOU LOSE ****")
            print(f"The correct word was - '{random_word}'")
            print("\nWould you like to play again? (y/n): ")
            step = 2
        elif "_" not in display:
            print("**** YOU WON ****")
            print("You guessed the correct word.")
            print("\nWould you like to play again? (y/n): ")
            step = 2
        else:
            # Continue playing
            print("Guess a letter:")

# STEP 2: Play Again Logic
elif step == 2:
    if user_input in ("y", "yes"):
        print(
            "\nRestarting...\n(Press 'Enter' or click 'Start Hangman' to generate a new word)"
        )
        step = 0
    elif user_input in ("n", "no"):
        print("Thanks for playing! Goodbye.")
        step = 3
    else:
        print("Please enter 'y' or 'n': ")

# STEP 3: Game Finished State
elif step == 3:
    print(
        "Game over. Click the 'Restart Hangman' button to start a completely new session."
    )
