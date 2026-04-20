// intercom always on for now
const isProduction = () => {
  return true;
};

function waitForIntercom() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.Intercom) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

function userDetails(user = {}, organization = {}) {
  const name = Object.keys(user).length ? `${user.firstName} ${user.lastName}` : null;
  return {
    user_id: user._id,
    name,
    email: user.email,
    phone: user.phoneNumber,
    // company: {
    //   id: organization._id,
    //   name: organization.orgName,
    //   created_at: organization.createdAt,
    // },
  };
}

export function toggle() {
  if (isProduction()) {
    const intercomEl = document.getElementsByClassName('intercom-messenger-frame');
    if (intercomEl.length > 0) {
      window.Intercom('hide');
    } else {
      window.Intercom('show');
    }
  }
}

export function update(user, organization) {
  if (isProduction()) {
    const details = userDetails(user, organization);
    window.Intercom('update', details);
  }
}

export async function boot(user, organization, hideLauncher = true) {
  if (isProduction()) {
    await waitForIntercom();
    const details = userDetails(user, organization);
    window.intercomSettings = {
      app_id: 'oma5ukwm',
      hide_default_launcher: hideLauncher,
    };
    window.Intercom('boot', details);
  }
}

export function connect(user, organization, ...args) {
  if (isProduction()) {
    console.log('Intercom -- Initializing');
    const w = window;
    const ic = w.Intercom;

    window.intercomSettings = {
      app_id: 'oma5ukwm',
      hide_default_launcher: true,
      ...userDetails(user, organization),
    };

    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', w.intercomSettings);
    } else {
      const d = document;
      const i = function () {
        i.c(args);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      const l = function () {
        const s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://widget.intercom.io/widget/oma5ukwm';
        const x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      };

      l();
    }
  } else {
    console.warn('Intercom - Is not production, skipping initialization...');
  }
}
