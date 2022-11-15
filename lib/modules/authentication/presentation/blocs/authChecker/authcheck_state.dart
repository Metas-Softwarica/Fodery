part of 'authcheck_bloc.dart';

abstract class AuthcheckState extends Equatable {
  const AuthcheckState();

  @override
  List<Object> get props => [];
}

class AuthcheckInitial extends AuthcheckState {}

class Authenticated extends AuthcheckState {
  final String message;

  Authenticated({required this.message});

  @override
  List<Object> get props => [message];
}

class AuthenticationFailed extends AuthcheckState {
  final String message;

  AuthenticationFailed({required this.message});

  @override
  List<Object> get props => [message];
}
