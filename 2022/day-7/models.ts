import * as Colors from "https://deno.land/std@0.167.0/fmt/colors.ts";

class Node {
    name: string;
    parent?: Dir;
    depth: number;

    constructor(name: string, parent?: Dir, depth: number = 0) {
        this.name = name;
        this.parent = parent;
        this.depth = depth;
    }

    isDir: boolean = this instanceof Dir;
}

export class Dir extends Node {

    children: Array<Node> = [];

    constructor(name: string, depth: number = 0, parent?: Dir,) {
        super(name, parent, depth);
    }

    // change directory -- always assumes we're moving one level up or down from the current directory
    // meaning it couldn't handle an argument like `../../desktop` or `desktop/images/animals` 
    cd(name: string): Dir {
        if (name === '..') return this.parent || this;
        else {
            const existingDir = this.children
                .find(node => node.name === name && node.isDir);

            // make the directory on the fly since we're generating the tree as we read in the input
            return existingDir as Dir || this.mkdir(name);
        }
    }

    // add a directory
    mkdir(name: string): Dir {
        const dir = new Dir(name, this.depth + 1, this);
        this.children.push(dir);
        return dir;
    }

    // add a file
    touch(name: string, size: number): File {
        const file = new File(name, size, this);
        this.children.push(file);
        return file;
    }

    printTree(cb: (dir: Dir) => boolean) {
        const tab = '| ';
        let indent = '';
        for (let i = 0; i < this.depth; i++) {
            indent += tab;
        }

        const name = cb && cb(this) ? Colors.green(this.name) : this.name

        console.log(indent + name, Colors.blue(this.getSize().toString()));

        this.children.forEach(c => {
            c.isDir && (c as Dir).printTree(cb);
            if (!c.isDir) {
                c = c as File;
                console.log(indent + tab + (c as File).name, (c as File).size);
            }
        })
    }

    getSize() {
        let sum = 0;

        this.children.forEach(c => {
            if (c.isDir) {
                sum += (c as Dir).getSize();
            } else {
                sum += (c as File).size;
            }
        });

        return sum;
    }

    filter(cb: (dir: Dir) => boolean, arr: Dir[] = []) {
        cb && cb(this) && arr.push(this);

        this.children.forEach(c => {
            c.isDir && (c as Dir).filter(cb, arr);
        });

        return arr;
    }
}


export class File extends Node {
    
    size: number;

    constructor(name: string, size: number, parent: Dir) {
        super(name, parent);
        this.size = size;
        this.depth = parent.depth + 1;
    }
}