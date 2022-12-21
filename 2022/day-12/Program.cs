string[] lines = System.IO.File.ReadAllLines("./input.txt");

(int[,], Point, Point) init() {
    var rows = lines.Length;
    var cols = lines[0].Length;

    var grid = new int[rows, cols];
    Point start = new(0, 0);
    Point end = new(0, 0);

    for (int row = 0; row < rows; row++) {
        for (int col = 0; col < cols; col++) {
            var character = lines[row][col];
            if (character == 'S') {
                start = new(row, col);
                character = 'a';
            }
            if (character == 'E') {
                end = new(row, col);
                character = 'z';
            }
            grid[row, col] = character - 'a';
        }
    }

    return (grid, start, end);
}

// gets the distance from start point to end point
int bfs(int[,] grid, Point start, Point end) {
    var q = new Queue<Item>();
    var visited = new HashSet<Point>();

    var startItem = new Item(0, start);

    q.Enqueue(startItem);
    visited.Add(start);


    while (q.Any()) {
        // distance, x and y of current item
        var (d, (x, y)) = q.Dequeue();

        // right, left, down, and up directions
        var directions = new Point[] {
            new (x + 1, y), new (x - 1, y), 
            new (x, y + 1), new (x, y - 1)
        };

        // destination x and y
        foreach (var point in directions) {

            var (dx, dy) = point;

            // if the point is outside of the grid
            if (dx < 0 || dy < 0 || dx >= grid.GetLength(0) ||dy >= grid.GetLength(1)) {
                continue;
            }

            // if we've already visited the point
            if (visited.Contains(point)) {
                continue;
            }

            // if the destination is not more than 1 taller than current
            if (grid[dx, dy] - grid[x, y] > 1) {
                continue;
            }

            // if our destination is our end goal
            if (dx == end.X && dy == end.Y) {
                return d + 1;
            }

            // add the current item to the queue with a distance 1 greater than current
            q.Enqueue(new Item(d + 1, point));
            visited.Add(point);
        }
    }

    // if not end target
    return -1;
}

// finds the distance from the start point to any point with a value of endValue
// we use this to start at our end point and find any 'a' value
int bfs2(int[,] grid, Point start, int endValue) {
    var q = new Queue<Item>();
    var visited = new HashSet<Point>();

    var startItem = new Item(0, start);

    q.Enqueue(startItem);
    visited.Add(start);

    while (q.Any()) {
        // distance, x and y of current item
        var (d, (x, y)) = q.Dequeue();

        // right, left, down, and up directions
        var directions = new Point[] {
            new (x + 1, y), new (x - 1, y), 
            new (x, y + 1), new (x, y - 1)
        };

        // destination x and y
        foreach (var point in directions) {

            var (dx, dy) = point;

            // if the point is outside of the grid
            if (dx < 0 || dy < 0 || dx >= grid.GetLength(0) ||dy >= grid.GetLength(1)) {
                continue;
            }

            // if we've already visited the point
            if (visited.Contains(point)) {
                continue;
            }

            // if the destination is shorter by more than 1, dont visit
            if (grid[dx, dy] - grid[x, y] < -1) {
                continue;
            }

            // if our destination is our end goal
            if (grid[dx, dy] == 0) {
                return d + 1;
            }

            // add the current item to the queue with a distance 1 greater than current
            q.Enqueue(new Item(d + 1, point));
            visited.Add(point);
        }
    }

    // if not end target
    return -1;
}

var (grid, start, end) = init();

Console.WriteLine($"Puzzle 1: {bfs(grid!, start, end)}");
Console.WriteLine($"Puzzle 2: {bfs2(grid!, end, 0)}");


record struct Item(int Distance, Point p);
record struct Point(int X, int Y);