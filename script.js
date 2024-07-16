import path from 'path';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';
import NodeID3 from 'node-id3';

// Function to get MP3 files from a directory
const getMp3Files = async (dir) => {
  try {
    const files = await fs.readdir(dir);
    return files.filter(file => path.extname(file).toLowerCase() === '.mp3');
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
};

// Function to update ID3 tags based on filename
const updateId3Tags = async (dir, files) => {
  for (const file of files) {
    const filePath = path.join(dir, file);
    const baseName = path.basename(file, path.extname(file));

    // Remove any content within square brackets
    const cleanedName = baseName.replace(/\[.*?\]/g, '').trim();

    // Split the cleaned name by ' - ' to get artist and title
    const parts = cleanedName.split(' - ');

    if (parts.length === 2) {
      const [artist, title] = parts;

      try {
        // Read the MP3 file
        const buffer = await fs.readFile(filePath);

        // Remove existing ID3 tags
        const success = NodeID3.removeTags(filePath);

        // Create new ID3 tag
        const tags = {
          title: title,
          artist: artist
          // Add other fields as needed
        };

        // Write ID3 tag
        const writeSuccess = NodeID3.write(tags, filePath);

        if (writeSuccess) {
          console.log(chalk.green(`Successfully wrote ID3 tag for ${file}`));
        } else {
          console.error('Could not write ID3 tag.');
        }
      } catch (err) {
        console.error('Could not read the file or write ID3 tag.', err);
      }
    } else {
      console.warn(chalk.yellow(`Skipping file with invalid format: ${file}`));
    }
  }
};

// CLI prompt
const promptUser = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'directory',
      message: 'Enter the directory path where your MP3 files are located:',
      default: '.',
      validate: async (input) => {
        try {
          const stats = await fs.lstat(input);
          return stats.isDirectory();
        } catch (err) {
          return 'Please enter a valid directory path.';
        }
      }
    }
  ]);

  const { directory } = answers;
  const mp3Files = await getMp3Files(directory);

  if (mp3Files.length > 0) {
    console.log(chalk.blue(`Found ${mp3Files.length} MP3 file(s) in ${directory}`));
    await updateId3Tags(directory, mp3Files);
  } else {
    console.log(chalk.red('No MP3 files found in the specified directory.'));
  }
};

promptUser();
