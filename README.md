# Personal Website

This is a repository containing the work around my personal website, [m4numbers.co.uk][1]
(may or may not be live at time of viewing).

The website itself is built in NodeJS, after a long and arduous period where it was in PHP,
and has not undergone the surgery to change it to Node, which has taken roughly two years at
this point, simply because I'm lazy, and there was a lot to change/redesign.

The move to PHP was predominantly due to wanting to try switching tech stacks away from my
previous stack of `PHP`, `MariaDB`, and `Apache`, which wasn't the most scalable.

The new (and probably improved) stack is built with `NodeJS` on top of `express` and
`MongoDB`. There is also additional scope to add in `Redis` at some point or other if you
look at the todo list below.

## Why is this project here?

In answer to an invented question of why I have put this code up on GitHub, instead of a
private Git server, I say thus: this site has nothing to hide apart from a few places where
I need to refactor out some overlong methods or re-imagine the engineering of a few routes.

The site itself uses the `config` package from npm which holds most of the secrets on
deployment, and the map of the site is only split into three authentication levels anyway:

 + Public: this is the area of the site that anyone can access at any time
     + Blog - This is a public blog. Very little else to say about it
     + Projects - This is a collection of all of the projects that have been worked on by
     me that are openly accessible
     + Hobbies (Art) - These are some examples of things that I have drawn
     + Hobbies (Writing) - These are some stories that have been written and are hosted here
     + Hobbies (Manga) - This is a collection of the manga that I have read and some of my
     opinions on it (backed by [anilist.co][2])
     + Hobbies (Anime) - This is a collection of the anime that I have seen and some of my
     opinions on it (backed by [anilist.co][2])
     + Contact me - Some links that can be used to contact me
     + About me - A long description about me
     + Sitemap - A list of available links for the site
     + Statistics - Some publicly available statistics about the site
 + Friends-only: this is an area of the site which is only accessible after answering a
 question that people I am close to will know the answer to
     + Me - This is an area of the site in general for people that would like to know more
     about me than they would probably like. The page itself has a longer description about
     me, probably
     + Me (Blog) - This is an extended blog that has all of the public blog entries in it,
     plus a few private ones that are more personal
     + Me (Kinks) - This is an 18+ only area of the site which contains some details of what
     my personal quirks are
 + Admin: this is the administration area of the site which controls what appears in the
 rest of the site.

## ToDo list of things

* Refactor routes to delegate into a journey folder
* Write tests for the website
* Add in a Redis instance for forcing login expiry and AC
* Extend the statistics page to have a few more metrics in it
* Restyle some of the admin background items

[1]: https://m4numbers.co.uk
[2]: https://anilist.co
