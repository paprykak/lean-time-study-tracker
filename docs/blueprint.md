# **App Name**: LeanTime Hub

## Core Features:

- Time Study Stopwatch: Accurate digital stopwatch displaying MM:SS:ms with Start, Pause, and Reset controls for timing lean manufacturing processes.
- Task Classification & Logging: Categorize and log observed durations as Value Added (VA), Non-Value Added (NVA), or Necessary Non-Value Added (NNVA), with an optional text input for task descriptions, resetting the timer after each log.
- Intelligent Task Description Tool: Suggest task descriptions for consistency across observations or auto-classify tasks using a generative AI model.
- Dynamic Event Data Table: Display a sortable table of all logged events, including ID, Category, Duration (seconds), Description, and individual deletion functionality.
- Lean Metrics Dashboard: Visualize time study data with a responsive Recharts donut chart showing percentage split of total time by category (VA, NNVA, NVA), and a summary card displaying total observed time, VA%, and NVA%.
- Data Export to CSV: Export the recorded time study data table to a downloadable CSV file for further analysis.
- Responsive Mobile Design: Utilize Tailwind CSS for a modern, responsive, and mobile-friendly interface optimized for tablets and phones on the shop floor.

## Style Guidelines:

- Primary accent color: A professional and stable blue (#1F52B8) to anchor the clean, industrial dashboard look, evoking reliability and data focus.
- Background color: A very light, almost white, subtle blue-grey (#F3F5F7) for optimal readability and a modern aesthetic, suitable for use in varied lighting conditions on a shop floor.
- Secondary accent color: A bright and clear cyan (#3BBFDB) used for interactive elements and highlights, providing distinct visual contrast and signaling engagement.
- Semantic action colors: Distinct green (#339933) for Value Added (VA) actions, a clear yellow-orange (#FFB833) for Necessary Non-Value Added (NNVA) actions, and a warning red (#CC2F2F) for Non-Value Added (NVA) actions, enhancing immediate visual understanding.
- Primary typeface: 'Inter' (sans-serif) for all text elements, chosen for its clear, modern, and objective appearance that prioritizes legibility, especially crucial for data interpretation across various screen sizes.
- Use minimalist and clearly recognizable icons with a flat design philosophy. This maintains a clean, industrial aesthetic and ensures quick, intuitive comprehension of functions and data points.
- Implement a responsive, mobile-first layout with generous spacing and clear information hierarchy. This ensures the application is efficiently usable on tablets and smartphones, reflecting the practical needs of Process Engineers in a lean manufacturing environment.
- Subtle and functional animations for UI feedback, such as transitions for button presses, timer changes, or chart updates. These are designed to enhance user experience by providing clear acknowledgments without creating distractions, aligning with the app's focus on efficiency.