fn main() {
    println!("Hello, world!");
}

#[cfg(test)]
mod tests {
    use regex::Regex;
    use std::fs;

    fn cal(v: &str) -> i32 {
        let match_first = Regex::new(r"(\d)").unwrap();
        let first = match match_first.captures(v) {
            Some(caps) => caps.get(1).map_or("", |m| m.as_str()),
            None => panic!("No digits found in {}", v),
        };

        let match_last = Regex::new(r"(\d)[^\d]*$").unwrap();
        let last = match match_last.captures(v) {
            Some(caps) => caps.get(1).map_or("", |m| m.as_str()),
            None => panic!("No digits found in {}", v),
        };
        let digits = format!("{}{}", first, last);
        match digits.parse::<i32>() {
            Ok(num) => num,
            Err(e) => panic!("Failed to parse: {}", e),
        }
    }

    #[test]
    fn result() {
        let contents = fs::read_to_string("./input.txt").expect("Should have read the file");

        assert_eq!(contents.len(), 21759);

        let lines = contents.split("\n");

        // let first_line = String::from(lines.next().unwrap());
        assert_eq!(cal("heightseven4two5"), 45);
        assert_eq!(cal("npskfdstpk2knsm"), 22);

        let mut total = 0;
        for line in lines {
            total += cal(line);
        }

        assert_eq!(total, 56049);
    }
}
