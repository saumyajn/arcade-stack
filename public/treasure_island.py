# If step is not defined, initialize it to 0
if "step" not in globals():
    step = 0
# Get User input
user_input = cmd if "cmd" in globals() else ""
user_input = user_input.strip()
name = ""

if step == 0:
    print(
        r'''
*******************************************************************************
   |                   |                  |                     |
 _________|________________.=""_;=.______________|_____________________|_______
|   |  ,-"_,=""     `"=.|                  |
|__________________|__"=._o`"-._        `"=.______________|___________________
|                `"=._o`"=._      _`"=._                     |
_________|_____________________:=._o "=._."_.-="'"=.__________________|_______
|     |    __.--" , ; `"=._o." ,-"""-._ ".   |
|___________________|_._"  ,. .` ` `` ,  `"-._"-._   ". '__|___________________
          |     |o`"=._` , "` `; .". ,  "-._"-._; ;              |
 _________|____________| ;`-.o`"=._; ." ` '`."\ ` . "-._ /_______________|_______
|     | |o ;    `"-.o`"=._``  '` " ,__.--o;   |
|___________________|_| ;     (#) `-.o `"=.`_.--"_o.-; ;___|___________________
____/______/______/___|o;._    "      `".o|o_.--"    ;o;____/______/______/____
/______/______/______/_"=._o--._        ; | ;        ; ;/______/______/______/_
____/______/______/______/__"=._o--._   ;o|o;     _._;o;____/______/______/____
/______/______/______/______/____"=._o._; | ;_.--"o.--"_/______/______/______/_
____/______/______/______/______/_____"=.o|o_.--""___/______/______/______/____
/______/______/______/______/______/______/______/______/______/______/_____ /
*******************************************************************************
'''
    )
    print("Welcome to Treasure Island.")
    print("What is your name.")
    step = 1
elif step == 1:
    name = user_input
    print(f"Hello, {name.upper()}..")
    print(
        "You just found a pirate's treasure map in an island nearby. Your mission is to find the treasure."
    )
    print(
        r"""
    *******************************************************************************
    ___
    ).x)
   (:_()
          
    *******************************************************************************
          """
    )
    print(
        "You're at a cross road. Where do you want to go? Type 'left' or 'straight' or 'right'"
    )
    step = 2
elif step == 2:
    direction = user_input.lower()
    if direction == "straight":
        print("You kept walking and looped back to the same position")
        print(
            "You are back at the same position. Where do you want to go now? Type 'left' or 'straight' or 'right'"
        )
        step = 2
    elif direction == "right":
        print("Oops! You walked into the den of unknown. Game Over.")
        print("(Type any key or click reload to restart)")
        step = 0
    elif direction == "left":
        print(
            "You have reached a pier. There is a boat to cross the river. Do you want to 'wait' for a boat or 'swim' across yourself?"
        )
        step = 3
    else:
        print(f"You had 3 options, you have chosen none. So, Game over. ")
        print("(Type any key or click reload to restart)")
        step = 0
elif step == 3:
    action = user_input.lower()
    if action == "swim":
        print("AHHH!!! You are attacked by pirahnas. RIP! Game over!!")
        print("(Type any key or click reload to restart)")
        step = 0
    elif action == "wait":
        print("You have crossed the river safely. ")
        print(
            "Now, you see 3 houses - one red, one yellow and one blue. Which colour do you choose?"
        )
        step = 4
elif step == 4:
    color = user_input.lower()
    if color == "red":
        print("It's a room full of thorns and fire. 🔥 Game Over!")
        print("(Type any key or click reload to restart)")
        step = 0
    elif color == "blue":
        print("You enter a room of deadly robots. 🤖🔪 Game Over!")
        print("(Type any key or click reload to restart)")
        step = 0
    elif color == "yellow":
        print(f"Congratulations {name.upper()}!! You found the treasure! 🏆💰 You Win!")
        print("You finally found the treasure chest filled with gold and jewels.")
        print("(Type any key or click reload  to restart)")
        step = 0
    else:
        print("You chose a door that doesn't exist. Game Over!")
        print("(Type any key or click reload to restart)")
        step = 0
else:
    print("An unexpected error occurred. Restarting the game.")
    step = 0
