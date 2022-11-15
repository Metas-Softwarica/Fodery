part of 'register_bloc.dart';

abstract class RegisterEvent extends Equatable {
  const RegisterEvent();

  @override
  List<Object> get props => [];
}

class RegisterFormSubmitted extends RegisterEvent {
  final UserAuthModel userModel;

  const RegisterFormSubmitted({required this.userModel});

  @override
  List<Object> get props => [userModel];
}
