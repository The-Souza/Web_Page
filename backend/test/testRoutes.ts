function prettyLog(label: string, data: object) {
  console.log(`\n===== ${label} =====`);

  if (Array.isArray(data)) {
    const total = data.length;
    const preview = data.slice(0, 5);

    if (preview.length > 0 && typeof preview[0] === "object") {
      console.table(preview);
    } else {
      console.log(JSON.stringify(preview, null, 2));
    }

    console.log(`(Mostrando ${preview.length} de ${total})`);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }

  console.log("================================\n");
}

export default async function testRoutes() {
  const usersRes = await fetch("http://localhost:5000/users");
  const users = await usersRes.json();
  prettyLog("Usuários", users);

  const accountsRes = await fetch("http://localhost:5000/accounts");
  const accounts = await accountsRes.json();
  prettyLog("Contas", accounts);

  const userIdRes = await fetch("http://localhost:5000/accounts/user/1");
  const userAccounts = await userIdRes.json();
  prettyLog("Contas do usuário 1", userAccounts);

  const emailRes = await fetch("http://localhost:5000/accounts/email/user1@example.com");
  const emailAccounts = await emailRes.json();
  prettyLog("Contas do email user1@example.com", emailAccounts);
}
