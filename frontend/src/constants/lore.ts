export const ASTRA_MSGS = [
  "Every champion was once a beginner. Your next quest awaits.",
  "The patterns you unlock today become the weapons of tomorrow.",
  "Struggling is the sound of your brain growing stronger.",
  "One question at a time — that's all it takes.",
  "The kingdom remembers every hero who answered the call.",
  "Consistency beats intensity. Show up today.",
  "Your future self will thank you for the work you do now.",
  "The best time to start was yesterday. The second best time is now.",
  "Every LeetCode problem is a pattern in disguise. You're learning to see them.",
  "Interviewers don't test what you know. They test how you think.",
];

export const LORE_DB: Record<string, { story: string; signals: string[]; mistakes: string[]; hints: string[] }> = {
  arrays: {
    story: 'The primordial forest — arrays are the most fundamental data structure. Linear access, contiguous memory, the building block of all patterns.',
    signals: ['Iterate over elements', 'Find max/min/sum', 'Subarray problems', 'In-place operations'],
    mistakes: ['Off-by-one in loop bounds', 'Forgetting edge case of empty array', 'Modifying array while iterating'],
    hints: ['Time complexity matters — always ask if O(n) is achievable', 'Sorting first often simplifies array problems', 'Two-pass solutions are fine if each pass is O(n)'],
  },
  hashing: {
    story: 'Memory Caverns — the HashMap trades space for speed. O(1) lookup is magic until you understand the hash function beneath.',
    signals: ['Need to check membership quickly', 'Count frequency of elements', 'Group elements by a property', 'Two-sum style problems'],
    mistakes: ['Forgetting to handle collisions conceptually', 'Using list when set is enough', 'Not considering key uniqueness'],
    hints: ['If brute force is O(n²), a hashmap can often reduce to O(n)', 'Think: what should the key be, what should the value be?', "Complement patterns: store what you've seen, look for what you need"],
  },
  twoptr: {
    story: 'Twin River — two indices converging or diverging. The pattern eliminates the need for nested loops when the array is sorted or has a property to exploit.',
    signals: ['Sorted array, find pair with target sum', 'Palindrome check', 'Partition/rearrange in-place', 'Merge two sorted structures'],
    mistakes: ['Forgetting to sort first when needed', 'Infinite loop if pointers never move', 'Wrong condition for pointer advancement'],
    hints: ['One pointer at start, one at end — classic for sorted arrays', 'Same-direction pointers (slow/fast) for cycle detection', 'Always verify: what invariant do you maintain?'],
  },
  sliding: {
    story: 'Moving Observatory — a variable or fixed-size window slides across the input. Avoids recomputing overlapping subproblems.',
    signals: ['Longest/shortest subarray satisfying a condition', 'Fixed window sum/average', 'Substring with constraints'],
    mistakes: ['Not shrinking window correctly', 'Forgetting to track the maximum while sliding', 'Wrong window expansion condition'],
    hints: ['Expand right pointer first, shrink left when condition violated', 'Use a frequency map inside window for character problems', 'Always update answer before or after shrinking'],
  },
  dp1: {
    story: 'Time Chamber — DP is memoized recursion. Identify the state, define the transition, set base cases. Most DP problems are 1D or 2D.',
    signals: ['Optimal substructure', 'Overlapping subproblems', 'Count ways / maximize / minimize'],
    mistakes: ['Wrong state definition', 'Missing base case', 'Incorrect transition direction (top-down vs bottom-up)'],
    hints: ['Ask: what information do I need to make a decision at each step?', 'Start with recursion, then memoize, then convert to tabulation', 'Classic 1D DP: Fibonacci, climbing stairs, house robber'],
  },
};
