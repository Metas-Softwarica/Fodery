part of 'register_bloc.dart';

abstract class RegisterState extends Equatable {
  const RegisterState();

  @override
  List<Object> get props => [];
}

class RegisterInitial extends RegisterState {}

class RegisterAttemptLoadingState extends RegisterState {}

class UserRegisteredState extends RegisterState {
  final String message;
  const UserRegisteredState({required this.message});
  @override
  List<Object> get props => [message];
}

class UserRegisterFailedState extends RegisterState {
  final String message;
  const UserRegisterFailedState({required this.message});
  @override
  List<Object> get props => [message];
}
