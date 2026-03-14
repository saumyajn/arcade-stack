import random
import requests
from hangman_art import logo, stages
from hangman_words import backup_word_list

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

    # Fetch random words
    try:
        response = requests.get(
            "https://random-word-api.herokuapp.com/word?number=100&diff=1&length=5",
            timeout=5,
        )
        if response.status_code == 200:
            word_list = response.json()
        else:
            word_list = backup_word_list
    except:
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
        print("\nRestarting...\n(Press 'Enter' or click Run to generate a new word)")
        step = 0
    elif user_input in ("n", "no"):
        print("Thanks for playing! Goodbye.")
        step = 3
    else:
        print("Please enter 'y' or 'n': ")

# STEP 3: Game Finished State
elif step == 3:
    print(
        "Game over. Click the 'Reload' button at the top to start a completely new session."
    )
