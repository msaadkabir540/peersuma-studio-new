exports.albumShortMediaUploadEmailTemplate = ({ user, client, link }) => `
           <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
        body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      .modal {
        background-color: white;
        padding: 20px;
        max-width: 600px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      }
      h1 {
        margin-top: 0;
      }
      .buttonContainer {
        text-align: center;
      }
      button {
        background-color: #3869d4;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 10px;
        align-self: center;
      }
      button a {
        color: white !important;
        text-decoration: none !important;
      }
      p:last-of-type {
        font-size: 14px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <table class="modal">
      <tr>
        <td colspan="2">
          <h1>Hi, ${user?.username}!</h1>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <p>
            Welcome, you have been invited by ${client?.name} to
            collaborate on the Tara Kelly project.Click on the button below to share your media to this project.
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="buttonContainer">
          <button>
            <a href="${link}"> Upload Media </a>
          </button>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <p>
            Welcome aboard, <br />
            ${client?.name}
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="2"><hr /></td>
      </tr>
      <tr>
        <td colspan="2">
          <p>
            If you’re having trouble with the button above, copy and paste the
            URL below into your web browser. ${link}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html> `;
