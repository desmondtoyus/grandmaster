function getRoles(role) {
  let roles = role.toString(2);
  roles = "0000000000".substr(roles.length) + roles;
  if (role == '1024') {
    return {
      super_admin: false,
      ops_admin: false,
      ops_policy: false,
      zone_admin: false,
      zone_ops: false,
      account_admin: false,
      account_ops: false,
      account_managed: false,
      advertiser_managed: true
    };
  } else {
    return {
      super_admin: roles.charAt(9) === "1",
      ops_admin: roles.charAt(8) === "1",
      ops_policy: roles.charAt(6) === "1",
      zone_admin: roles.charAt(5) === "1",
      zone_ops: roles.charAt(4) === "1",
      account_admin: roles.charAt(3) === "1",
      account_ops: roles.charAt(2) === "1",
      account_managed: roles.charAt(0) === "1"

    };
  }
}

export function isAllowed(view, user) {
  const roles = getRoles(user.role);

  if (roles.super_admin) {
    return true;
  }
  if (roles.ops_admin) {
    return true;
  }
  if (roles.ops_policy) {
    switch(view) {
      case "Home":
      case "Analytics":
      case "Menu":
        return true;
    }
  }
  if (roles.zone_admin) {
    return true;
  }
  if (roles.zone_ops) {
    switch(view) {
      case "Advertisers":
      case "Publishers":
      case "Marketplaces":
      case "Home":
      case "Analytics":
      case "Integrations":
      case "Menu":
        return true;
    }
  }
  if (roles.account_admin) {
    switch(view) {
      case "Users":
      case "Advertisers":
      case "Publishers":
      case "Marketplaces":
      case "Integrations":
      case "Home":
      case "Analytics":
      case "Menu":
        return true;
    }
  }
  if (roles.account_ops) {
    switch (view) {
      case "Advertisers":
      case "Publishers":
      case "Marketplaces":
      case "Integrations":
      case "Home":
      case "Analytics":
      case "Menu":
        return true;
    }
  }
  if (roles.account_managed) {
    switch(view) {
      case "Reporting":
        return true;
    }
  }

  if (roles.advertiser_managed) {
    console.log('VIEW', view);
    switch (view) {
      case "Advertiser":
        return true;
    }
  }
  return false;
}

export function isURLValid(obj) {
  let keys = Object.keys(obj);
  return (keys.includes('aid') && keys.includes('cid') && keys.includes('fid') && keys.includes('pid') && keys.includes('tid') && keys.includes('st'));
}

export function parseQuery(str) {
  const pairs = str.slice(1).split('&');

  let result = {};
  pairs.forEach((pair) => {
    pair = pair.split('=');
    result[pair[0]] = pair[1];
  });

  return result;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}