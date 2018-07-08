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
                    issues (states: OPEN) {
                        totalCount
                    }
                    pullRequests (states: OPEN){
                        totalCount
                    }
                }
            }
        }
    }
    `;
    gqlRequest(query, null, response => {
        console.log(`response: ${response}`);
        $("header h2").text(`Hello ${response.data.viewer.name}`);
        if (response.data.viewer.repos.totalCount > 0) $("ul").empty();
        const repos = response.data.viewer.repos.nodes;
        repos.forEach(repo => {
            console.log(`repo: ${repo.name}`)
            $("ul").append(`<li>${repo.name}</li>`);
        });
    })
});