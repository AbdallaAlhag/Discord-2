import os

# Run git log command
os.system('git log --oneline > commits.txt')

# Filter for relevant commits (optional - edit manually afterward)
with open('commits.txt', 'r') as file:
    lines = file.readlines()

# Save as features list
with open('features_list.txt', 'w') as outfile:
    for line in lines:
        if 'feature' in line.lower():  # Filter by keyword
            outfile.write(line)
