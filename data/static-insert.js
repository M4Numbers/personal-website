db.staticdocuments.insertMany([
  {
    '_id':     'ABOUT_ME',
    'content': 'Put simply... I\'m a gamer. I could end it there quite happily and that\'s that.\nYou could stop here and I\'d tell you that that is the same impression you\'d\nwalk away with after reading all of this.\n\nI can\'t remember the exact date in which I was introduced to gaming, but I\nthink I can make a pretty accurate stab at the progression I had... Gamegear,\nto Playstation 2, to GBA, to SNES, to SEGA MegaDrive (or similar SEGA system),\nto a GameBoy DS, to Playstation 3, to Wii, to PC, to Playstation 4.\n\nEven though I was introduced to a computer a lot earlier than listed (I think\nthat it was 2002 when I was introduced), I didn\'t start gaming on one properly\nuntil a lot later when I had money to burn and the PC gaming market really\nstarted flying with the introduction of direct downloading.\n\nAnd even then, that was quite late... I\'ve only been on Steam since about\nJuly 2011.\n\nI\'m sad to say that I\'m one of those scumbags that prefer console gaming. I\nlike the assurance that no-matter what game I get, it will run on this one\nbox that I don\'t have to do anything with. However... that doesn\'t mean I\nhate PC gaming... I love it; I love the amount of games available at the snap\nof a finger at a much lower price than the console market.\n\nRecently, however, I\'ve splashed out on getting a higher spec computer that\'s\nable to do a bit more than stutter and start at every damn game I play. The\nfact that it\'s a desktop already puts it above my laptop, but the key things\nto note are that it\'s running a 6th gen i5, 16 gigabytes of DDR4 RAM, a 4GB\nNVIDIA 960 GTX, and a few bells and whistles to keep it running at a stable\n28 degrees Celsius.\n\nIf you wanted to know about me regarding my non-gaming life... I\'m a fourth\nyear Computing Science student/weirdo at Newcastle University in the UK,\ncurrently specialising into distributed systems and security in computing\nbecause they sounded fancy on the box and present interesting problems to\nbe solved.\n\nI have around five years of programming experience at this point in scripted\nand non-scripted languages such as Python, C/++, Java, and PHP (there are\nothers, but I don\'t really want to list them all - those are the ones that\nI\'ve had the most recent experience in). I\'d classify myself as primarily\neither a web developer or a C++ developer at this point in time due to the\nsheer amount of time I\'ve sunk into those areas of development.\n\nI\'m currently looking into doing a PhD around security which should hopefully\nprove interesting and keep me going for the next few years as the UK\ncollapses around itself. Not quite sure about the specifics of that yet,\nbut I\'m hopeful that I\'ll be able to get it with the project I have planned\n(I\'ll probably showcase it on here at some point or other when I get around\nto finishing the development log part of the site).\n\nIn case you were starting to think that I was just a boring gaming person\nwho did programming most of the time (which... isn\'t really that far from\nthe truth - the boring part I mean), I also have a large history of watching\nand reading stuff that goes by the genres of anime and manga (because I\'m a\nstudent and I have a gargantuan amount of time that I should probably have\nspent studying which mysteriously disappeared at some point down the line).\nWhat I have seen/read can be seen on this site in the appropriate headings,\nbut fair warning... my tastes are somewhat broad and I will watch anything\nthat piques my interest at any point in time soooo... yeah...\n\nBasically, if you want confirmation that I\'m a weirdo, give those two\ncategories a bit of a search...\n',
  },

  {
    '_id':     'KNOWING_ME',
    'content': 'Hello world!',
  },

  {
    '_id':     'CONTACT_ME',
    'content': [
      {
        'contact_method': 'YouTube',
        'fa_style':       'fab',
        'fa_icon':        'fa-youtube',
        'contact_link':   'https://youtube.com/J4Numbers',
      },
      {
        'contact_method': 'Twitter',
        'fa_style':       'fab',
        'fa_icon':        'fa-twitter',
        'contact_link':   'https://twitter.com/j4numbers',
      },
      {
        'contact_method': 'Email',
        'fa_style':       'fas',
        'fa_icon':        'fa-at',
        'contact_link':   'mailto:j4numbers@gmail.com',
      },
      {
        'contact_method': 'Steam',
        'fa_style':       'fab',
        'fa_icon':        'fa-steam-symbol',
        'contact_link':   '#',
      },
      {
        'contact_method': 'GitHub',
        'fa_style':       'fab',
        'fa_icon':        'fa-github',
        'contact_link':   'https://github.com/j4numbers',
      },
      {
        'contact_method': 'Twitch',
        'fa_style':       'fab',
        'fa_icon':        'fa-twitch',
        'contact_link':   'https://twitch.tv/j4numbers',
      },
    ],
  },

  {
    '_id':     'SITEMAP',
    'content': [
      {
        'page_name': 'About me',
        'page_link': '/about',
      },
      {
        'page_name': 'Administrator Toolkit',
        'page_link': 'admin',
      },
      {
        'page_name': 'Anime',
        'page_link': '/hobbies/anime',
      },
      {
        'page_name': 'Art',
        'page_link': '/hobbies/art',
      },
      {
        'page_name': 'Blog',
        'page_link': '/blog',
      },
      {
        'page_name': 'Contact me',
        'page_link': '/contact',
      },
      {
        'page_name': 'Hobbies',
        'page_link': '/hobbies',
      },
      {
        'page_name': 'Homepage',
        'page_link': '/',
      },
      {
        'page_name': 'Manga',
        'page_link': '/hobbies/manga',
      },
      {
        'page_name': 'Projects',
        'page_link': '/projects',
      },
      {
        'page_name': 'Site statistics',
        'page_link': '/stats',
      },
      {
        'page_name': 'Stories',
        'page_link': '/hobbies/stories',
      },
    ],
  },
]);
