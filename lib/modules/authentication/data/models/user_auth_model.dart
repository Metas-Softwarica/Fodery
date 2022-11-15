class UserAuthModel {
  final String? firstName;
  final String? lastName;
  final String? email;
  final String? password;
  final String? accessToken;
  final String? refreshToken;

  const UserAuthModel(
      {this.firstName,
      this.lastName,
      this.email,
      this.password,
      this.accessToken,
      this.refreshToken});

  Map<String, dynamic> toJsonForRegistration() {
    return {
      "first_name": firstName,
      "last_name": lastName,
      "email": email,
      "password": password
    };
  }

  Map<String, dynamic> toJsonForLogin() {
    return {"email": email, "password": password};
  }

  factory UserAuthModel.fromJsonForTokens({required Map<String, dynamic> map}) {
    return UserAuthModel(
        accessToken: map["access"], refreshToken: map["refresh"]);
  }
}
