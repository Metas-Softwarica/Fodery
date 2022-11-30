import 'package:flutter/material.dart';

import '../../../core/constants/app_colors.dart';

class FilterChipWidget extends StatefulWidget {
  final String label;
  const FilterChipWidget({super.key, required this.label});

  @override
  State<FilterChipWidget> createState() => _FilterChipWidgetState();
}

class _FilterChipWidgetState extends State<FilterChipWidget> {
  late bool status;

  @override
  void initState() {
    status = false;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      highlightColor: Colors.transparent,
      splashColor: Colors.transparent,
      onTap: () {
        setState(() {
          status = !status;
        });
      },
      child: Chip(
        deleteIcon: const Icon(Icons.cancel),
        onDeleted: status
            ? () {
                setState(() {
                  status = !status;
                });
              }
            : null,
        label: Text(widget.label),
        backgroundColor: status ? AppColors.red : AppColors.grey,
      ),
    );
  }
}
