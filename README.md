<p align="center">
    <a href="https://hashnode.com/">
        <img src="https://cdn.svarun.dev/common/hashnode/icon.png" width="150px"/>
    </a>
</p>

<h1 align="center">Hashnode Blogs - <i>Github Action</i></h1>
<p align="center">~ Fetch & Display Your Latest Blog Posts From <a href="https://hashnode.com/"><strong>Hashnode</strong></a> ~</p>

## ⚙️ Configuration
| Option | Description | Default |
| :---: | :---: | :---: |
| `TYPE` | Set this to `GIST` if you want to display latest posts in a pinned gists | `REPOSITORY` |
| `FILE` | Provide file location or provide **GIST ID** if `TYPE` set to `GIST` | `README.md` |
| `USERNAME` | Your Hashnode Username | - |
| `BLOG_URL` | Your blog url. you can leave it empty to auto generate. but if you are facing any issue with auto generated link. make sure to provide your blog url here. | - |
| `STYLE` | Options :  `list`, `list-ordered`, `blog`, `blog-right`, `blog-left`, `blog-alternate`, `blog-grid` | `list` |
| `COUNT` | No of latest posts to display | `6` |

---
### Please check the [Demo Repository](https://github.com/varunsridharan/demo-action-hashnode-blog) to preview all possible **Styles**
---

## 🚀 Usage

### 💾  In Repository File
#### 1. Add The Below Content To Your README.md / Any file you want to showcase
```markdown
## My Latest Blog Posts 👇
<!-- HASHNODE_BLOG:START -->
<!-- HASHNODE_BLOG:END -->
```
#### 2. Configure The Worklfow
<!-- START RAW -->
```yaml
name: "📚 Blog Updater"

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *' # Runs Every Day

jobs:
  update_blogs:
    name: "Update Blogs"
    runs-on: ubuntu-latest
    steps:
      - name: "📥  Fetching Repository Contents"
        uses: actions/checkout@main

      - name: "📚  Hashnode Updater"
        uses: "varunsridharan/action-hashnode-blog@main"
        with:
          USERNAME: 'your-username' # Hashnode Username
          COUNT: 10 # MAX Visisble
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
<!-- END RAW -->


### 📌  In Pinned Gists
1. Create a new public GitHub Gist (https://gist.github.com/)
2. Create a token with the `gist` scope.
3. [Create a secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) 🔑 by going to **GitHub repo > Settings > Secrets > New secret** with the following:
    1. Name : `GIST_TOKEN`
    2. Value : The token with the `gist` scope generated previously.

<!-- START RAW -->
```yaml
name: "📚 Blog Updater"

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *' # Runs Every Day

jobs:
  update_blogs:
    name: "Update Blogs"
    runs-on: ubuntu-latest
    steps:
      - name: "📚  Hashnode Updater"
        uses: "varunsridharan/action-hashnode-blog@main"
        with:
          USERNAME: 'your-username' # Hashnode Username
          COUNT: 5 # MAX Visisble
          FILE: "88ca4064876a7971a1c61e8e19e42b98" # GIST ID
          TYPE: "gist"
        env:
          GITHUB_TOKEN: ${{ secrets.GIST_TOKEN }} # Personal Access Token With Gists Scope
```
<!-- END RAW -->

<!-- START common-footer.mustache -->
## 📝 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[Checkout CHANGELOG.md](https://github.com/varunsridharan/action-hashnode-blog/blob/main/CHANGELOG.md)


## 🤝 Contributing
If you would like to help, please take a look at the list of [issues](https://github.com/varunsridharan/action-hashnode-blog/issues/).


## 📜  License & Conduct
- [**MIT License**](https://github.com/varunsridharan/action-hashnode-blog/blob/main/LICENSE) © [Varun Sridharan](website)
- [Code of Conduct](https://github.com/varunsridharan/.github/blob/master/CODE_OF_CONDUCT.md)


## 📣 Feedback
- ⭐ This repository if this project helped you! :wink:
- Create An [🔧 Issue](https://github.com/varunsridharan/action-hashnode-blog/issues/) if you need help / found a bug


## 💰 Sponsor
[I][twitter] fell in love with open-source in 2013 and there has been no looking back since! You can read more about me [here][website].
If you, or your company, use any of my projects or like what I’m doing, kindly consider backing me. I'm in this for the long run.

- ☕ How about we get to know each other over coffee? Buy me a cup for just [**$9.99**][buymeacoffee]
- ☕️☕️ How about buying me just 2 cups of coffee each month? You can do that for as little as [**$9.99**][buymeacoffee]
- 🔰         We love bettering open-source projects. Support 1-hour of open-source maintenance for [**$24.99 one-time?**][paypal]
- 🚀         Love open-source tools? Me too! How about supporting one hour of open-source development for just [**$49.99 one-time ?**][paypal]

<!-- Personl Links -->
[paypal]: https://sva.onl/paypal
[buymeacoffee]: https://sva.onl/buymeacoffee
[twitter]: https://sva.onl/twitter/
[website]: https://sva.onl/website/


## Connect & Say 👋
- **Follow** me on [👨‍💻 Github][github] and stay updated on free and open-source software
- **Follow** me on [🐦 Twitter][twitter] to get updates on my latest open source projects
- **Message** me on [📠 Telegram][telegram]
- **Follow** my pet on [Instagram][sofythelabrador] for some _dog-tastic_ updates!

<!-- Personl Links -->
[sofythelabrador]: https://www.instagram.com/sofythelabrador/
[github]: https://sva.onl/github/
[twitter]: https://sva.onl/twitter/
[telegram]: https://sva.onl/telegram/


---

<p align="center">
<i>Built With ♥ By <a href="https://sva.onl/twitter"  target="_blank" rel="noopener noreferrer">Varun Sridharan</a> <a href="https://en.wikipedia.org/wiki/India">
   <img src="https://cdn.svarun.dev/flag-india.jpg" width="20px"/></a> </i> <br/><br/>
   <img src="https://cdn.svarun.dev/codeispoetry.png"/>
</p>

---


<!-- END common-footer.mustache -->
