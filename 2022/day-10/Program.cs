// Created With: dotnet new console --framework net7.0
// Run: dotnet run
string[] lines = System.IO.File.ReadAllLines("./input.txt");

var x = 1;

var q = new Queue<Instruction>();

var i = 1;
foreach (var l in lines) {

    var executeBase = i == 1 ? 0 : q.Last().ExecuteAt;

    if (l == "noop") {
        q.Enqueue(new Instruction { Value = 0, ExecuteAt = executeBase + 1 });
    }

    var words = l.Split(' ');

    if (l.StartsWith("addx")) {
        var v = Int32.Parse(words[1]);
        q.Enqueue(new Instruction { Value = v, ExecuteAt = executeBase + 2 });
    }

    i++;
}

var locations = new List<int>();

var sum = 0;
var cycle = 1;
while (q.Any()) {

    locations.Add(x);

    if ((cycle + 20) % 40 == 0) { 
        var signalStrength = cycle * x; 
        sum += signalStrength;
    }
    
    while (q.Any() && q.Peek().ExecuteAt == cycle) {
        x += q.Dequeue().Value;
    }

    cycle++;
}

Console.WriteLine($"Puzzle 1: {sum}");
Console.WriteLine("Puzzle 2:");

i = 0;
foreach (var l in locations) {

    var mod = i % 40;
    if (mod == 0) Console.WriteLine();

    var symbol = Math.Abs(l - mod) <= 1 ? "#" : ".";

    Console.Write(symbol);
    i++;
}


class Instruction {
    public required int Value { get; set; }
    // execute at the end of this cycle
    public required int ExecuteAt { get; set; }
}