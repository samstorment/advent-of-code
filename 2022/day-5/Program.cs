// Created With: dotnet new console --framework net7.0
// Run: dotnet run
using System.Text.RegularExpressions;


string[] lines = System.IO.File.ReadAllLines("./input.txt");


Puzzle1();
Puzzle2();

void Puzzle1() {
    var startIndex = GetInitialCrateHeight() + 2;
    var stacks = GetStacks();

    for (int i = startIndex; i < lines.Length; i++) {
        var ins = new Instruction(lines[i]);
        
        for (int j = 0; j < ins.Amount; j++) {
            stacks[ins.Dest].Push(stacks[ins.Src].Pop());
        }
    }

    PrintTopOfStacks(stacks, "Puzzle 1: ");
}


void Puzzle2() {
    var startIndex = GetInitialCrateHeight() + 2;
    var stacks = GetStacks();

    for (int i = startIndex; i < lines.Length; i++) {
        var ins = new Instruction(lines[i]);
        
        // intermediate stack to preserve the order of popped items
        var s = new Stack<char>();

        for (int j = 0; j < ins.Amount; j++) {
            s.Push(stacks[ins.Src].Pop());
        }

        var count = s.Count;

        for (int j = 0; j < count; j++) {
            stacks[ins.Dest].Push(s.Pop());
        }

    }

    PrintTopOfStacks(stacks, "Puzzle 2: ");
}


void PrintTopOfStacks(Stack<char>[] stacks, string label) {
    Console.Write(label);
    foreach(var s in stacks) {
        Console.Write(s.Peek());
    }
    Console.WriteLine();
}


int GetInitialCrateHeight() {
    int i = 0;

    foreach (var line in lines) {
        if (String.IsNullOrWhiteSpace(line)) {
            return i - 1;
        }
        i++;
    }
    return 0;
}

Stack<char>[] GetStacks() {
    var crateHeight = GetInitialCrateHeight();

    string numLine = lines[crateHeight]!;
    var dataIndices = new List<int>();

    int dataIndex = 0;
    foreach (char c in numLine) {
        if (c != ' ') {
            dataIndices.Add(dataIndex);
        }
        dataIndex++;
    }

    var numStacks = dataIndices.Count();

    // Console.WriteLine(numStacks);

    var stacks = new Stack<char>[numStacks];

    for (int i = 0; i < numStacks; i++) {
        stacks[i] = new Stack<char>();
    }

    // go through each line where we know there is crate data
    for (int i = crateHeight - 1; i >= 0; i--) {
        var line = lines[i];

        // get the data from the data indices
        var j = 0;
        foreach (var ind in dataIndices) {

            char data = line[ind];

            if (data != ' ') {
                stacks[j].Push(data);
            }

            j++;
        }
    }

    return stacks;
}

class Instruction {

    public Instruction(string line)
    {
        var numString = line
            .Replace("move ", "")
            .Replace(" from ", " ")
            .Replace(" to ", " ");

        var nums = numString.Split(' ').Select(str => Int32.Parse(str)).ToArray();

        Amount = nums[0];
        // subtract one since we want to use array indexes not counting numbers
        Src = nums[1] - 1;
        Dest = nums[2] - 1;
    }

    public int Src { get; set; }
    public int Dest { get; set; }
    public int Amount { get; set; }

    public override string ToString() => $"Move {Amount} from {Src} to {Dest}";
}