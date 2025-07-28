CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Bob', 'https://bob.com', 'First Post', 0);

INSERT INTO blogs (author, url, title, likes) VALUES ('Fred', 'https://fredrecipes.com', 'Start to a new beginning', 0);