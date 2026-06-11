export interface Question {
  id: string;
  name: string;
  diff: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  url: string;
}

export interface Realm {
  id: string;
  name: string;
  icon: string;
  pattern: string;
  color: string;
  group: string;
  month: number;
  artifact: { icon: string; name: string; desc: string };
  lore: string;
  questions: Question[];
}

export interface Level {
  lvl: number;
  title: string;
  xp: number;
  max: number;
  avatar: string;
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export const REALMS: Realm[] = [
  {
    id: 'arrays', name: 'Foundation Forest', icon: '🌲', pattern: 'Arrays & Basics',
    color: '#4ade80', group: 'Foundation Forest', month: 1,
    artifact: { icon: '🗡️', name: 'Iron Blade', desc: 'Forged from the ore of every array traversal mastered' },
    lore: 'The primordial forest where all patterns were born. Master arrays to lay the foundation.',
    questions: [
      { id: 'a1', name: 'Two Sum', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/two-sum/' },
      { id: 'a2', name: 'Best Time to Buy and Sell Stock', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 'a3', name: 'Contains Duplicate', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/contains-duplicate/' },
      { id: 'a4', name: 'Product of Array Except Self', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 'a5', name: 'Maximum Subarray', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/maximum-subarray/' },
      { id: 'a6', name: 'Maximum Product Subarray', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { id: 'a7', name: 'Find Minimum in Rotated Sorted Array', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'a8', name: 'Search in Rotated Sorted Array', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'a9', name: '3Sum', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/3sum/' },
      { id: 'a10', name: 'Container With Most Water', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/container-with-most-water/' },
    ]
  },
  {
    id: 'hashing', name: 'Memory Caverns', icon: '💎', pattern: 'Hashing',
    color: '#9b7eff', group: 'Foundation Forest', month: 1,
    artifact: { icon: '💠', name: 'Memory Crystal', desc: 'Allows instant recall of any stored truth' },
    lore: 'Deep caverns where knowledge is stored and retrieved in the blink of an eye.',
    questions: [
      { id: 'h1', name: 'Valid Anagram', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/valid-anagram/' },
      { id: 'h2', name: 'Group Anagrams', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/group-anagrams/' },
      { id: 'h3', name: 'Top K Frequent Elements', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'h4', name: 'Encode and Decode Strings', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/encode-and-decode-strings/' },
      { id: 'h5', name: 'Longest Consecutive Sequence', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { id: 'h6', name: 'Valid Sudoku', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/valid-sudoku/' },
      { id: 'h7', name: 'Subarray Sum Equals K', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { id: 'h8', name: 'Two Sum II - Input Array Is Sorted', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
    ]
  },
  {
    id: 'twoptr', name: 'Twin River', icon: '🌊', pattern: 'Two Pointers',
    color: '#4fc3f7', group: 'Foundation Forest', month: 1,
    artifact: { icon: '🧭', name: 'Explorer Compass', desc: 'Always finds the optimal path through any sequence' },
    lore: 'Two rivers converging — the ancient technique of dual traversal.',
    questions: [
      { id: 'tp1', name: 'Valid Palindrome', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 'tp2', name: 'Two Sum II', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: 'tp3', name: '3Sum', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/3sum/' },
      { id: 'tp4', name: 'Container With Most Water', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: 'tp5', name: 'Trapping Rain Water', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/trapping-rain-water/' },
      { id: 'tp6', name: 'Boats to Save People', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/boats-to-save-people/' },
      { id: 'tp7', name: 'Sort Colors', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/sort-colors/' },
    ]
  },
  {
    id: 'sliding', name: 'Moving Observatory', icon: '🔭', pattern: 'Sliding Window',
    color: '#fbbf24', group: 'Foundation Forest', month: 1,
    artifact: { icon: '🔮', name: 'Shifting Lens', desc: 'Reveals patterns within moving ranges of data' },
    lore: 'An observatory that scans the horizon — always watching a window of possibilities.',
    questions: [
      { id: 'sw1', name: 'Best Time to Buy and Sell Stock', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 'sw2', name: 'Longest Substring Without Repeating Characters', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 'sw3', name: 'Longest Repeating Character Replacement', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { id: 'sw4', name: 'Permutation in String', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/permutation-in-string/' },
      { id: 'sw5', name: 'Minimum Window Substring', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: 'sw6', name: 'Sliding Window Maximum', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { id: 'sw7', name: 'Max Consecutive Ones III', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/max-consecutive-ones-iii/' },
      { id: 'sw8', name: 'Fruit Into Baskets', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/fruit-into-baskets/' },
    ]
  },
  {
    id: 'prefix', name: 'Crystal Archives', icon: '📜', pattern: 'Prefix Sum',
    color: '#f0c060', group: 'Foundation Forest', month: 1,
    artifact: { icon: '📚', name: 'Ancient Tome', desc: 'Precomputed wisdom for answering range queries instantly' },
    lore: 'Crystallized scrolls that store the accumulated knowledge of all that came before.',
    questions: [
      { id: 'px1', name: 'Running Sum of 1d Array', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/running-sum-of-1d-array/' },
      { id: 'px2', name: 'Find Pivot Index', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/find-pivot-index/' },
      { id: 'px3', name: 'Range Sum Query - Immutable', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/range-sum-query-immutable/' },
      { id: 'px4', name: 'Subarray Sum Equals K', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { id: 'px5', name: 'Product of Array Except Self', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: 'px6', name: 'Count Number of Nice Subarrays', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/count-number-of-nice-subarrays/' },
    ]
  },
  {
    id: 'bsearch', name: 'Halfmoon Mines', icon: '⛏️', pattern: 'Binary Search',
    color: '#e85d3a', group: 'Foundation Forest', month: 1,
    artifact: { icon: '⚖️', name: 'Balance Scale', desc: 'Divides any problem space in half with perfect precision' },
    lore: 'Ancient miners who discovered that halving the search space unlocks even the deepest secrets.',
    questions: [
      { id: 'bs1', name: 'Binary Search', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/binary-search/' },
      { id: 'bs2', name: 'Find Minimum in Rotated Sorted Array', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { id: 'bs3', name: 'Search in Rotated Sorted Array', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'bs4', name: 'Koko Eating Bananas', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { id: 'bs5', name: 'Find Peak Element', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/find-peak-element/' },
      { id: 'bs6', name: 'Search a 2D Matrix', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: 'bs7', name: 'Median of Two Sorted Arrays', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
      { id: 'bs8', name: 'Time Based Key-Value Store', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/time-based-key-value-store/' },
    ]
  },
  {
    id: 'linked', name: 'Linked Marshes', icon: '🔗', pattern: 'Linked Lists',
    color: '#4fc3f7', group: 'Data Structure Valley', month: 2,
    artifact: { icon: '⛓️', name: 'Ethereal Chain', desc: 'A chain of memory nodes that bends without breaking' },
    lore: 'A labyrinthine marsh where each stepping stone leads to the next — never random, always linked.',
    questions: [
      { id: 'll1', name: 'Reverse Linked List', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'll2', name: 'Merge Two Sorted Lists', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: 'll3', name: 'Reorder List', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/reorder-list/' },
      { id: 'll4', name: 'Remove Nth Node From End of List', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 'll5', name: 'Copy List with Random Pointer', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { id: 'll6', name: 'Add Two Numbers', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/add-two-numbers/' },
      { id: 'll7', name: 'Linked List Cycle', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'll8', name: 'Find the Duplicate Number', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      { id: 'll9', name: 'LRU Cache', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/lru-cache/' },
      { id: 'll10', name: 'Merge K Sorted Lists', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'll11', name: 'Reverse Nodes in k-Group', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
    ]
  },
  {
    id: 'stack', name: 'Iron Tower', icon: '🏗️', pattern: 'Stack',
    color: '#9b7eff', group: 'Data Structure Valley', month: 2,
    artifact: { icon: '🛡️', name: 'Iron Shield', desc: 'A last-in, first-out defense against any problem' },
    lore: 'An iron monolith built layer by layer. Only the brave who master LIFO may climb to the top.',
    questions: [
      { id: 'st1', name: 'Valid Parentheses', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 'st2', name: 'Min Stack', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/min-stack/' },
      { id: 'st3', name: 'Evaluate Reverse Polish Notation', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
      { id: 'st4', name: 'Generate Parentheses', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/generate-parentheses/' },
      { id: 'st5', name: 'Daily Temperatures', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/daily-temperatures/' },
      { id: 'st6', name: 'Car Fleet', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/car-fleet/' },
      { id: 'st7', name: 'Largest Rectangle in Histogram', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      { id: 'st8', name: 'Basic Calculator', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/basic-calculator/' },
    ]
  },
  {
    id: 'heap', name: 'Clockwork Forge', icon: '⚙️', pattern: 'Heap / Priority Queue',
    color: '#e85d3a', group: 'Data Structure Valley', month: 2,
    artifact: { icon: '🔔', name: 'Priority Bell', desc: 'Always surfaces the most urgent task first' },
    lore: 'A mechanical forge that continuously reorganizes itself to bring the highest priority to the surface.',
    questions: [
      { id: 'hp1', name: 'Kth Largest Element in a Stream', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
      { id: 'hp2', name: 'Last Stone Weight', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/last-stone-weight/' },
      { id: 'hp3', name: 'K Closest Points to Origin', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
      { id: 'hp4', name: 'Kth Largest Element in an Array', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 'hp5', name: 'Task Scheduler', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/task-scheduler/' },
      { id: 'hp6', name: 'Design Twitter', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/design-twitter/' },
      { id: 'hp7', name: 'Find Median from Data Stream', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 'hp8', name: 'Merge K Sorted Lists', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
    ]
  },
  {
    id: 'backtrack', name: 'Mirror Maze', icon: '🪞', pattern: 'Backtracking',
    color: '#ff6eb4', group: 'Data Structure Valley', month: 2,
    artifact: { icon: '🗝️', name: 'Maze Key', desc: 'Unlocks every path by trying and unmaking choices' },
    lore: 'A maze of infinite mirrors — you must explore every path and retreat when dead ends appear.',
    questions: [
      { id: 'bt1', name: 'Subsets', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/subsets/' },
      { id: 'bt2', name: 'Combination Sum', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/combination-sum/' },
      { id: 'bt3', name: 'Permutations', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/permutations/' },
      { id: 'bt4', name: 'Subsets II', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/subsets-ii/' },
      { id: 'bt5', name: 'Combination Sum II', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/combination-sum-ii/' },
      { id: 'bt6', name: 'Word Search', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/word-search/' },
      { id: 'bt7', name: 'Palindrome Partitioning', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/palindrome-partitioning/' },
      { id: 'bt8', name: 'Letter Combinations of a Phone Number', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
      { id: 'bt9', name: 'N-Queens', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/n-queens/' },
      { id: 'bt10', name: 'Sudoku Solver', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/sudoku-solver/' },
    ]
  },
  {
    id: 'trees', name: 'Ancient Grove', icon: '🌳', pattern: 'Trees',
    color: '#4ade80', group: 'Tree Kingdom', month: 3,
    artifact: { icon: '🍃', name: 'Living Branch', desc: 'Grows recursively, branching to reach every corner' },
    lore: 'Ancient trees whose roots and branches mirror the recursive beauty of tree structures.',
    questions: [
      { id: 'tr1', name: 'Invert Binary Tree', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: 'tr2', name: 'Maximum Depth of Binary Tree', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 'tr3', name: 'Diameter of Binary Tree', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
      { id: 'tr4', name: 'Balanced Binary Tree', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/balanced-binary-tree/' },
      { id: 'tr5', name: 'Same Tree', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/same-tree/' },
      { id: 'tr6', name: 'Subtree of Another Tree', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/subtree-of-another-tree/' },
      { id: 'tr7', name: 'Lowest Common Ancestor of BST', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: 'tr8', name: 'Binary Tree Level Order Traversal', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 'tr9', name: 'Binary Tree Right Side View', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
      { id: 'tr10', name: 'Count Good Nodes in Binary Tree', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/' },
      { id: 'tr11', name: 'Validate Binary Search Tree', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: 'tr12', name: 'Kth Smallest Element in BST', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { id: 'tr13', name: 'Construct Binary Tree from Preorder and Inorder Traversal', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
      { id: 'tr14', name: 'Binary Tree Maximum Path Sum', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      { id: 'tr15', name: 'Serialize and Deserialize Binary Tree', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
    ]
  },
  {
    id: 'bst', name: 'Royal Arboretum', icon: '🏯', pattern: 'BST',
    color: '#4ade80', group: 'Tree Kingdom', month: 3,
    artifact: { icon: '🌿', name: 'Sorted Vine', desc: 'Maintains perfect order in every branch' },
    lore: 'The royal gardens where every tree is perfectly ordered by decree of the ancient king.',
    questions: [
      { id: 'bst1', name: 'Search in a Binary Search Tree', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/' },
      { id: 'bst2', name: 'Insert into a Binary Search Tree', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/' },
      { id: 'bst3', name: 'Delete Node in a BST', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/delete-node-in-a-bst/' },
      { id: 'bst4', name: 'Validate Binary Search Tree', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: 'bst5', name: 'Kth Smallest Element in BST', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
      { id: 'bst6', name: 'Lowest Common Ancestor of Binary Tree', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
    ]
  },
  {
    id: 'dfs', name: 'Spider Frontier', icon: '🕸️', pattern: 'DFS / Graph',
    color: '#9b7eff', group: 'Graph Realm', month: 3,
    artifact: { icon: '🕷️', name: 'Spider Silk', desc: 'Weaves a web across every connected node' },
    lore: 'A vast web of connections — explore every strand before retreating.',
    questions: [
      { id: 'df1', name: 'Number of Islands', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'df2', name: 'Clone Graph', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/clone-graph/' },
      { id: 'df3', name: 'Max Area of Island', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/max-area-of-island/' },
      { id: 'df4', name: 'Pacific Atlantic Water Flow', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
      { id: 'df5', name: 'Surrounded Regions', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/surrounded-regions/' },
      { id: 'df6', name: 'Rotting Oranges', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/rotting-oranges/' },
      { id: 'df7', name: 'Walls and Gates', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/walls-and-gates/' },
      { id: 'df8', name: 'Course Schedule', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/course-schedule/' },
      { id: 'df9', name: 'Course Schedule II', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/course-schedule-ii/' },
      { id: 'df10', name: 'Redundant Connection', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/redundant-connection/' },
      { id: 'df11', name: 'Word Ladder', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/word-ladder/' },
    ]
  },
  {
    id: 'bfs', name: 'Sky Routes', icon: '☁️', pattern: 'BFS / Graph',
    color: '#4fc3f7', group: 'Graph Realm', month: 3,
    artifact: { icon: '🪁', name: 'Sky Compass', desc: 'Charts the shortest path through any network' },
    lore: 'Sky routes that spread outward like ripples — always finding the shortest way.',
    questions: [
      { id: 'bf1', name: 'Number of Islands', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'bf2', name: 'Rotting Oranges', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/rotting-oranges/' },
      { id: 'bf3', name: 'Walls and Gates', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/walls-and-gates/' },
      { id: 'bf4', name: 'Word Ladder', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/word-ladder/' },
      { id: 'bf5', name: 'Nearest Exit from Entrance in Maze', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/' },
      { id: 'bf6', name: 'Snakes and Ladders', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/snakes-and-ladders/' },
      { id: 'bf7', name: 'Open the Lock', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/open-the-lock/' },
    ]
  },
  {
    id: 'dsu', name: 'Union Sanctum', icon: '🔮', pattern: 'Disjoint Set Union',
    color: '#f0c060', group: 'Graph Realm', month: 3,
    artifact: { icon: '🪬', name: 'Union Amulet', desc: 'Unites any two elements into one family' },
    lore: 'A sanctum where all things are connected — Union-Find reveals invisible bonds between nodes.',
    questions: [
      { id: 'ds1', name: 'Number of Connected Components', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
      { id: 'ds2', name: 'Redundant Connection', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/redundant-connection/' },
      { id: 'ds3', name: 'Graph Valid Tree', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/graph-valid-tree/' },
      { id: 'ds4', name: 'Accounts Merge', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/accounts-merge/' },
    ]
  },
  {
    id: 'dp1', name: 'Time Chamber', icon: '⏳', pattern: '1D Dynamic Programming',
    color: '#ff6eb4', group: 'DP Citadel', month: 4,
    artifact: { icon: '⌛', name: 'Temporal Hourglass', desc: 'Freezes optimal subproblems in time for instant reuse' },
    lore: 'A chamber outside of time — where decisions made in the past ripple forward into the future.',
    questions: [
      { id: 'dp1a', name: 'Climbing Stairs', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: 'dp1b', name: 'Min Cost Climbing Stairs', diff: 'Easy', xp: 5, url: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
      { id: 'dp1c', name: 'House Robber', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/house-robber/' },
      { id: 'dp1d', name: 'House Robber II', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/house-robber-ii/' },
      { id: 'dp1e', name: 'Longest Palindromic Substring', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { id: 'dp1f', name: 'Palindromic Substrings', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/palindromic-substrings/' },
      { id: 'dp1g', name: 'Decode Ways', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/decode-ways/' },
      { id: 'dp1h', name: 'Coin Change', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/coin-change/' },
      { id: 'dp1i', name: 'Maximum Product Subarray', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/maximum-product-subarray/' },
      { id: 'dp1j', name: 'Word Break', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/word-break/' },
      { id: 'dp1k', name: 'Longest Increasing Subsequence', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 'dp1l', name: 'Partition Equal Subset Sum', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
    ]
  },
  {
    id: 'dp2', name: 'Echoing Vaults', icon: '🏛️', pattern: '2D Dynamic Programming',
    color: '#e85d3a', group: 'DP Citadel', month: 4,
    artifact: { icon: '🗺️', name: 'Grid Parchment', desc: 'Maps every possible path through a 2D problem space' },
    lore: 'Vaults where each chamber echoes the decisions from the row above.',
    questions: [
      { id: 'dp2a', name: 'Unique Paths', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/unique-paths/' },
      { id: 'dp2b', name: 'Longest Common Subsequence', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { id: 'dp2c', name: 'Best Time to Buy and Sell Stock with Cooldown', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/' },
      { id: 'dp2d', name: 'Coin Change II', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/coin-change-ii/' },
      { id: 'dp2e', name: 'Target Sum', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/target-sum/' },
      { id: 'dp2f', name: 'Interleaving String', diff: 'Medium', xp: 15, url: 'https://leetcode.com/problems/interleaving-string/' },
      { id: 'dp2g', name: 'Longest Increasing Path in a Matrix', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/' },
      { id: 'dp2h', name: 'Distinct Subsequences', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/distinct-subsequences/' },
      { id: 'dp2i', name: 'Edit Distance', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/edit-distance/' },
      { id: 'dp2j', name: 'Burst Balloons', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/burst-balloons/' },
      { id: 'dp2k', name: 'Regular Expression Matching', diff: 'Hard', xp: 30, url: 'https://leetcode.com/problems/regular-expression-matching/' },
    ]
  },
];

export const LEVELS: Level[] = [
  { lvl: 1, title: 'Intern Hunter', xp: 0, max: 100, avatar: '🧑‍💻' },
  { lvl: 2, title: 'Code Explorer', xp: 100, max: 300, avatar: '🗺️' },
  { lvl: 3, title: 'Pattern Detective', xp: 300, max: 600, avatar: '🔍' },
  { lvl: 4, title: 'Interview Survivor', xp: 600, max: 1000, avatar: '⚔️' },
  { lvl: 5, title: 'OA Destroyer', xp: 1000, max: 1600, avatar: '💥' },
  { lvl: 6, title: 'Placement Knight', xp: 1600, max: 2400, avatar: '🛡️' },
  { lvl: 7, title: 'DSA Assassin', xp: 2400, max: 3600, avatar: '🗡️' },
  { lvl: 8, title: 'Offer Collector', xp: 3600, max: 9999, avatar: '👑' },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_quest', icon: '🌟', name: 'First Quest', desc: 'Complete your very first quest' },
  { id: 'first_five', icon: '⚡', name: 'Rising Star', desc: 'Solve 5 questions' },
  { id: 'ten', icon: '🔥', name: 'On Fire', desc: 'Solve 10 questions' },
  { id: 'twentyfive', icon: '💪', name: 'Gaining Momentum', desc: 'Solve 25 questions' },
  { id: 'fifty', icon: '🏅', name: 'Half Century', desc: 'Solve 50 questions' },
  { id: 'hundred', icon: '💯', name: 'Centurion', desc: 'Solve 100 questions' },
  { id: 'twohundred', icon: '🌌', name: 'Galaxy Brain', desc: 'Solve all 200+ quests' },
  { id: 'streak3', icon: '🕯️', name: 'Consistent', desc: 'Maintain a 3-day streak' },
  { id: 'streak7', icon: '🔆', name: 'Week Warrior', desc: 'Maintain a 7-day streak' },
  { id: 'streak30', icon: '☀️', name: 'Solar Devotion', desc: 'Maintain a 30-day streak' },
  { id: 'hashing_master', icon: '💎', name: 'Hashing Master', desc: 'Complete Memory Caverns' },
  { id: 'tree_whisperer', icon: '🌳', name: 'Tree Whisperer', desc: 'Complete Ancient Grove' },
  { id: 'graph_conqueror', icon: '🕸️', name: 'Graph Conqueror', desc: 'Complete Spider Frontier' },
  { id: 'dp_survivor', icon: '⏳', name: 'DP Survivor', desc: 'Complete Time Chamber' },
  { id: 'foundation_clear', icon: '🌲', name: 'Forest Guardian', desc: 'Complete Foundation Forest' },
  { id: 'offer_collector', icon: '👑', name: 'Offer Collector', desc: 'Complete all realms' },
];

export const REALM_PROGRESSION = [
  'arrays', 'hashing', 'twoptr', 'sliding', 'prefix', 'bsearch',
  'linked', 'stack', 'heap', 'backtrack',
  'trees', 'bst', 'dfs', 'bfs', 'dsu',
  'dp1', 'dp2',
];

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

export function getLevelInfo(xp: number): Level {
  let level = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) { level = LEVELS[i]; break; }
  }
  return level;
}

export function getActiveRealm(completed: Record<string, unknown>): string {
  for (const rid of REALM_PROGRESSION) {
    const r = REALMS.find(x => x.id === rid);
    if (!r) continue;
    const done = r.questions.filter(q => completed[q.id]).length;
    if (done < r.questions.length) return rid;
  }
  return REALM_PROGRESSION[0];
}

export function getMasteryRank(pct: number) {
  if (pct >= 100) return { cls: 'master', icon: '👑', label: 'Master' };
  if (pct >= 75) return { cls: 'expert', icon: '⚔️', label: 'Expert' };
  if (pct >= 50) return { cls: 'adept', icon: '🔮', label: 'Adept' };
  if (pct >= 25) return { cls: 'apprentice', icon: '🗺️', label: 'Apprentice' };
  return { cls: 'novice', icon: '🌱', label: 'Novice' };
}
