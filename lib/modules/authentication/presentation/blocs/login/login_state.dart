part of 'login_bloc.dart';

abstract class LoginState extends Equatable {
  const LoginState();

  @override
  List<Object> get props => [];
}

class LoginInitial extends LoginState {}

class LoginLoadingState extends LoginState {}

class LoginSuccessState extends LoginState {
  final String message;
  const LoginSuccessState({required this.message});
}

class LoginFailedState extends LoginState {
  final String errorMessage;
  const LoginFailedState({required this.errorMessage});
}
