// test/models_spec.js
/* globals describe afterEach it beforeEach */

/* ================================= SETUP ================================= */

process.env.NODE_ENV = "testing";

const { assert } = require("chai");
const { db, TABLES } = require("../app/config/knex");
const projects = require("../db/models/projects");
const tags = require("../db/models/tags");
const users = require("../db/models/users");

const tagName = "new tag";
const projectTitle = "new project";
const projectBody = "new project body text";
const screenshotUrl = "http://example.com/screenshot.png";
const liveUrl = "http://example.com";
const githubUrl = "http://github.com/rifkegribenes";

const username = "testUserName";
const email = "test@email.com";
const github_id = "1234";
const github_token = "5678";

/* ================================= TESTS ================================= */

describe("db models", () => {
  afterEach(() => {
    return db(TABLES.PROJECTS_TAGS)
      .del()
      .then(() => db(TABLES.TAGS).del())
      .then(() => db(TABLES.PROJECTS).del())
      .then(() => db(TABLES.USERS).del());
  });

  it("creates a new project", () => {
    return projects
      .createProject(
        projectTitle,
        projectBody,
        screenshotUrl,
        liveUrl,
        githubUrl
      )
      .then(([result]) => {
        assert.equal(result.title, projectTitle);
        assert.equal(result.body, projectBody);
        assert.equal(result.screenshot_url, screenshotUrl);
        assert.equal(result.live_url, liveUrl);
        assert.equal(result.github_url, githubUrl);
        return db.select("*").from(TABLES.PROJECTS);
      })
      .then(([result]) => {
        assert.equal(result.title, projectTitle);
        assert.equal(result.body, projectBody);
        assert.equal(result.screenshot_url, screenshotUrl);
        assert.equal(result.live_url, liveUrl);
        assert.equal(result.github_url, githubUrl);
      });
  });

  it("creates a new tag", () => {
    return tags
      .createTag(tagName)
      .then(result => {
        assert.equal(result.tag, tagName);
        return db.select("*").from(TABLES.TAGS);
      })
      .then(([result]) => {
        assert.equal(result.tag, tagName);
      });
  });

  it("creates a new user", () => {
    return users
      .createUser(username, email, github_id, github_token)
      .then(result => {
        assert.deepEqual(result[0].username, username);
        assert.deepEqual(result[0].email, email);
        assert.deepEqual(result[0].github_id, github_id);
        assert.deepEqual(result[0].github_token, github_token);
        return db.select("*").from(TABLES.USERS);
      })
      .then(([result]) => {
        assert.equal(result.username, username);
        assert.equal(result.email, email);
        assert.equal(result.github_id, github_id);
        assert.equal(result.github_token, github_token);
      });
  });

  describe("projects, tags, and users", () => {
    let projectId;
    let tagId;
    let userId;

    // seed with a tag, 2 projects, and a user before each test
    beforeEach(() => {
      return tags
        .createTag(tagName)
        .then(tag => {
          tagId = tag.id;
          return projects.createProject(
            projectTitle,
            projectBody,
            screenshotUrl,
            liveUrl,
            githubUrl
          );
        })
        .then(() =>
          projects.createProject(
            projectTitle,
            projectBody,
            screenshotUrl,
            liveUrl,
            githubUrl
          )
        )
        .then(([project]) => (projectId = project.id))
        .then(() => users.createUser(username, email, github_id, github_token))
        .then(user => {
          userId = user[0].id;
        });
    });

    it("attaches a project and tag", () => {
      return projects
        .attachProjectTag(projectId, tagId)
        .then(() => {
          return db
            .select("*")
            .from(TABLES.PROJECTS_TAGS)
            .where({
              project_id: projectId,
              tag_id: tagId
            });
        })
        .then(result => assert.equal(result.length, 1));
    });

    it("gets one project with all associated tags", () => {
      return projects
        .attachProjectTag(projectId, tagId)
        .then(() => projects.getProjectByIdWithTags(projectId))
        .then(result => {
          assert.equal(result.title, projectTitle);
          assert.deepEqual(result.tags, [tagName]);
        });
    });

    it("gets all projects with associated tags", () => {
      return projects
        .attachProjectTag(projectId, tagId)
        .then(() => projects.getAllProjectsWithTags())
        .then(results => {
          assert.equal(Array.isArray(results), true);
          assert.equal(results.length, 2);
          assert.deepEqual(results[0].title, projectTitle);
          assert.deepEqual(results[0].body, projectBody);
          assert.deepEqual(results[0].screenshot_url, screenshotUrl);
          assert.deepEqual(results[0].live_url, liveUrl);
          assert.deepEqual(results[0].github_url, githubUrl);
          assert.typeOf(results[0].tags, "array");
        });
    });

    it("gets one user by id", () => {
      return users.getUserById(userId).then(result => {
        assert.equal(result.username, username);
        assert.equal(result.email, email);
        assert.equal(result.github_id, github_id);
        assert.equal(result.github_token, github_token);
        return db.select("*").from(TABLES.USERS);
      });
    });
  });
});
