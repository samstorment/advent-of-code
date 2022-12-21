// Created With: dotnet new console --framework net7.0
// Run: dotnet run
string[] lines = System.IO.File.ReadAllLines("./input.txt");

var numRedundant = 0;
var numOverlap = 0;

foreach (var line in lines) {
    var ranges = line.Split(",");

    var elf1 = new Range(ranges[0]);
    var elf2 = new Range(ranges[1]);

    if (elf1.Contains(elf2) || elf2.Contains(elf1)) {
        numRedundant++;
    }

    if (elf1.Overlaps(elf2)) {
        numOverlap++;
    }
}

Console.WriteLine($"Puzzle 1: {numRedundant}");
Console.WriteLine($"Puzzle 2: {numOverlap}");

class Range {

    public Range(string range) {
        var nums = range.Split("-");
        Low = Int32.Parse(nums[0]);
        High = Int32.Parse(nums[1]);
    }

    public bool Contains(Range range) => this.Low <= range.Low && this.High >= range.High;

    public bool Overlaps(Range range) {
        var highestLow = Math.Max(this.Low, range.Low);
        var lowestHigh = Math.Min(this.High, range.High);

        return highestLow <= lowestHigh;
    }

    public int Low { get; }
    public int High { get; }

    public override string ToString() => $"{Low}-{High}";
}