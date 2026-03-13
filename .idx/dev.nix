# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # pkgs.go
    pkgs.zsh
    pkgs.zsh-completions
    pkgs.zsh-autocomplete
    pkgs.zsh-autosuggestions
    pkgs.zsh-syntax-highlighting
    pkgs.zsh-autoenv
    pkgs.python312
    pkgs.python312Packages.pip
    pkgs.nodejs_latest
    # pkgs.nodePackages.nodemon
  ];

  # Sets environment variables in the workspace
  env = {
    VERTEX_API_KEY="AQ.Ab8RN6I2fHKQPUY53CuEjRU3xLbV1cAcUeHlszy8JPxHoZyE8g";
    GEMINI_API_KEY="AIzaSyAa6Su_K2leVPsQfYZ3Z7z3KKgIXwpW_-U";
    OPENAI_API_KEY="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";
    GOOGLE_CLOUD_PROKECT="developer-profile-karl";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          # Example: run "npm run dev" with PORT set to IDX's defined port for previews,
          # and show it in IDX's web preview panel
          command = ["npm" "run" "dev"];
          manager = "web";
          env = {
            # Environment variables to set for your server
            PORT = "$PORT";
          };
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        npm-install = "cd frontend && npm install --force";
        venv-install = "python -m venv venv && source venv/bin/activate && pip install -r backend/requirements.txt && cd backend && ./manage migrate"
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start a background task to watch and re-build backend code
        # watch-backend = "npm run watch-backend";
        start-backend = "cd backend && ./manage runserver";
        # start-frontend = "cd frontend && npm run dev $PORT";
      };
    };
  };
}
