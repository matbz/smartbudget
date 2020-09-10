<template>
  <div class="login-container">
    <div class="login-block">
      <form>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          id="username"
          v-model.trim="credentials.username" />
        <input
          type="password"
          placeholder="Password"
          id="password"
          v-model.trim="credentials.password"
        />
        <button type="submit" @click.prevent="login()">Sign In</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', this.credentials);
        await this.$store.dispatch('getBudgetId', this.$store.getters.user);
        await this.$store.dispatch('getAccounts');
        this.credentials.username = '';
        this.credentials.password = '';
        this.$router.push({ name: 'budget' });
      } catch (error) {
        this.$toasted.error('Login data is not valid.');
      }
    }
  }
};
</script>


<style scoped>
.login-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #244564;
}

.login-block {
    width: 320px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    border-top: 5px solid #244564;
    margin: 100px auto;
}

.login-block h1 {
    text-align: center;
    color: #000;
    font-size: 18px;
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 20px;
}

.login-block input {
    width: 100%;
    height: 42px;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    font-size: 14px;
    padding: 0 20px 0 50px;
    outline: none;
}

.login-block input#username {
    background: #fff url('../../../static/user_icon.png') 20px top no-repeat;
    background-size: 16px 80px;
}

.login-block input#password {
    background: #fff url('../../../static/lock_icon.png') 20px top no-repeat;
    background-size: 16px 80px;
}

.login-block input:active, .login-block input:focus {
    border: 2px solid #000;
}

.login-block button {
    width: 100%;
    height: 40px;
    background: #3674A7;
    box-sizing: border-box;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    outline: none;
    cursor: pointer;
}

.login-block button:hover {
    background: #4495D7;
}
</style>


