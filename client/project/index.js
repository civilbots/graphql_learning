const fullStar = "★";
const emptyStar = "☆";

const commitFragment = `
fragment commitFragment on Repository {
  ref(qualifiedName: "master") {
    target {
      ... on Commit {
        history {
          totalCount
        }
      }
    }
  }
}
`;

let queryRepoList;

let mutationAddStar;

let mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
    // MAKE GRAPHQL REQUEST
    $.post({
        url: "https://api.github.com/graphql",
        contentType: "applicatin/json",
        headers: {
            Authorization: "bearer ..."
        },
        data: JSON.stringify({
            query: query,
            variables: variables
        }),
        success: onSuccess,
        error: error => console.log(error)
    })

}

function starHandler(element) {
    // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function () {
    // GET NAME AND REPOSITORIES FOR VIEWER
    const query = `
    {
        viewer {
            name
            repos: repositories(first: 5, orderBy: {field: CREATED_AT, direction: ASC}) {
                totalCount
                nodes {
                    name
                    openIssues: issues (states: OPEN) {
                        totalCount
                    }
                    totalIssues: issues {
                        totalCount
                    }
                    openPullRequests: pullRequests (states: OPEN){
                        totalCount
                    }
                    totalPullRequests: pullRequests {
                        totalCount
                    }
                    ... commitFragment
                }
            }
        }
    }
    `+ commitFragment;
    gqlRequest(query, null, response => {
        console.log(`response: ${response}`);
        $("header h2").text(`Hello ${response.data.viewer.name}`);
        if (response.data.viewer.repos.totalCount > 0) $("ul").empty();
        const repos = response.data.viewer.repos.nodes;
        repos.forEach(repo => {
            console.log(`repo: ${repo.name}`)
            const content = `
                <h3>${repo.name} </h3>
                <p>${repo.ref.target.history.totalCount} commits</p>
                <p>${repo.openIssues.totalCount} openIssues</p>
                <p>${repo.totalIssues.totalCount} totalIssues</p>
                <p>${repo.openPullRequests.totalCount} openPullRequests</p>
                <p>${repo.totalPullRequests.totalCount} totalPullRequests</p>
            `;
            $("ul").append(`<li>${content}</li>`);
        });
    })
});